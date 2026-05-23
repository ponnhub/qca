const express = require('express')
const mongoose = require('mongoose');
const { ReplSet } = require('mongodb-topology-manager');

const app = express()
const port = 3001

const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',//'http://localhost:3002',
  }
});
// const io = require('socket.io')
const path = require('path');
const User = require('./models/user');
const Unit = require('./models/unit');
const LineGroup = require('./models/lineGroup')

//Allow all requests from all domains & localhost
app.all('/*', function (_, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  next();
});

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

app.use('/static', express.static(path.join(__dirname, 'public')))


const mongoURI = 'mongodb://localhost:27017,127.0.0.1:27018/qca?replicaSet=rs0' //'mongodb://localhost/pmp'; //

const updatedData = (change) => {
  return {
    ns: {
      coll: change.ns.coll
    },
    documentKey: change.documentKey,
    updateDescription: change.updateDescription
  }
}

const db = mongoose.connect(mongoURI, function(err){
  if(err){
      throw err
  }
  console.log('Database connected')

  io.of("/userns").on('connection',(socket)=>{

      console.log(`user ${socket.id} connected`)

      socket.on('visibleChanged', visibilityData => {
        console.log(visibilityData)
      })

      // socket.on('joinRoom',(data)=>{      // data will look like => {myID: "123123"}
      //     console.log('user joined room')
      //     socket.join(data.id)          
      // })

      User.watch().on('change',(change) => {

        // console.log(`${socket.id} has changes`)
        console.log(change);

        switch (change.operationType) {
          case 'insert':
            socket.emit('user:insert',change.fullDocument)
            break;
          case 'update':
            socket.emit('user:update',updatedData(change))
            break;
          default:
            break;
        }
      })

      socket.on("disconnecting", () => {
        console.log(socket.rooms); // the Set contains at least the socket ID
      });

      socket.on("disconnect", () => {
        console.log(socket.id);
        // console.log(socket.rooms);

      console.log('user disconnected')
        // if  (socket.rooms.size === 0) socket.disconnect()
      });
  })


  // User.watch().on('change',(change)=>{

  //   console.log('User has changes')

  //   switch (change.operationType) {
  //     case 'insert':
  //       io.to(change.fullDocument._id).emit('changes',change.fullDocument)
  //       break;
  //     case 'update':
  //       io.to(change.documentKey._id).emit('changes',change.updateDescription)
  //       break;
  //     default:
  //       break;
  //   }
  // })
  // Unit.watch().on('change',(change)=>{
  //   console.log('Unit has changes')
  //   io.to(change.fullDocument._id).emit('changes',change.fullDocument)
  // })

})

const conn = mongoose.connection

app.get('/', (req, res) => {
  res.send('Hello World!')
})

function checkAuth(req, res, next) {

  // let data = req.params.authData

  User.findOne({
    userId: req.params.id
    }, "role",
    function (err, user) {
      if (err) {
        return res.status(500).send({
            error: err
        });
      }
      console.log(`user from check auth: ${user}`);

      //check authorizatin per role here then:
      console.log('authorized');
      next()
    })
}

//UNIT

app.get('/units', checkAuth,  (req, res) => {

  // const session = await db.startSession();
  Unit.find({}, function (err, array) {
    if (err) {
      return res.status(500).send({
          error: err
      });
    }
    // console.log(array);
    res.send(array)
  })
})


app.post('/unit', checkAuth, (req, res) => {


  if (!req.body.id) {
    var unit = new Unit(req.body);

    return unit.save(function (err, savedUnit) {
        if (err) {
            return response.status(500).send({
                error: err
            });
        }
        Unit.findOne({
            _id: savedUnit._id
        })
        // .populate('pilot ')
        .exec(function (err, unit) {
            if (err) {
                return response.status(500).send({
                    error: err
                });
            }
            res.send(unit);
        });
    });
  }

  Unit.findOneAndUpdate({
        _id: req.body.id
      }, req.body, {
    upsert: true,
    new: true
  }).exec(function (err, unit) {
    if (err) {
      return res.status(500).send({
        error: err
      });
    }
    res.send(unit)
  })
})

//USER
app.get('/user/:id', checkAuth,  (req, res) => {

  // const session = await db.startSession();
  User.findOne({
    userId: ''
  }, function (err, user) {
    if (err) {
      return res.status(500).send({
          error: err
      });
    }
    res.send(user)
  })
})


app.get('/users', checkAuth,  (req, res) => {

  // const session = await db.startSession();
  User.find({}, function (err, array) {
    if (err) {
      return res.status(500).send({
          error: err
      });
    }
    // console.log(array);
    res.send(array)
  })
})

app.post('/user', (req, res) => {

  console.log('====================================');
  console.log(req.body);
  console.log('====================================');
  // const session = await db.startSession();
  User.findOneAndUpdate({
    userId: req.body.userId
  }, req.body, {
    upsert: true,
    new: true
  }).exec(function (err, user) {
    if (err) {
      return res.status(500).send({
        error: err
      });
    }
    res.send(user)
  })
})

app.put('/user/unit', (req, res) => {

  console.log('====================================');
  console.log(req.body);
  console.log('====================================');
  // const session = await db.startSession();

  return User.findOne({
    userId: req.body.userId
  })
  .exec(async function (err, user) {
    if (err) {
      console.log(err);
      // return res.status(500).send({
      //   error: err
      // });
    }

    const session = await conn.startSession();
    session.startTransaction();

    await User.findOneAndUpdate({
      _id: user._id
    }, {
      $set: {
        ...req.body,
        unit: req.body.unitId
      }
    }, {
      upsert: true,
      new: true
    })
    .session(session)


    await Unit.findOneAndUpdate({
      _id: req.body.unitId
    }, {
      $addToSet: {
        members: user._id
      }
    }).session(session)

    await session.commitTransaction();
    session.endSession();
    res.sendStatus(200)

  })
})


//GROUP
app.get('/group/:id', checkAuth,  (req, res) => {

  // const session = await db.startSession();
  LineGroup.findOne({
    groupId: ''
  }, function (err, group) {
    if (err) {
      return res.status(500).send({
          error: err
      });
    }
    res.send(group)
  })
})

server.listen(port, () => {
  console.log(`QCA API  listening on port ${port}`)
})