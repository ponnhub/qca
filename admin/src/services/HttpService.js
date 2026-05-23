import DBService from 'services/dbService';
const dbs = new DBService()


class HttpService {

     getAllUsers () {
        return new Promise((resolve, reject) => {

            dbs.get('/users')
            .then(users => resolve(users))
            .catch(err => reject(err))
        
         })    
      }
    
     upsertUser(user) {
         return new Promise((resolve, reject)=> {        
            // console.log(user);        
            dbs.post('/user', user)
            .then(user => resolve(user))
            .catch(err => reject(err))
         })
      }

    updateUserUnit(user, unit) {
        return new Promise((resolve, reject)=> {        
            // console.log(user);        
            dbs.updateUserUnit(user, unit)
            .then(result => resolve(result))
            .catch(err => reject(err))
         })

    }

     getAllUnits () {
        return new Promise((resolve, reject) => {

            dbs.get('/units')
            .then(array => resolve(array))
            .catch(err => reject(err))
        
         })    
      }

      upsertUnit(unit) {
        return new Promise((resolve, reject)=> {        
        //    console.log(unit);        
           dbs.post('/unit', unit)
           .then(data => resolve(data))
           .catch(err => reject(err))
        })
      }
}

export default HttpService