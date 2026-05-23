class DBService {

    setPath(path) {
        this.path = path
    }

    get(path) {
        return new Promise((resolve, reject) => {
            fetch(path,{
                method: 'get',
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              .then(data => data.json())
              .then(results => resolve(results))
              .catch(err => {
                  console.log(err)
                  reject(err)
              })
        })
    }

    post(path, body) {

        return new Promise((resolve, reject) => {                
            fetch(path, {
                method: 'post',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(data => data.json())
            .then(results => resolve(results))
            .catch(err => {
                console.log(err)
                reject(err)
            })
        })

    }

    updateUserUnit (userId, unitId) {
        
        return new Promise((resolve, reject) => {                
            fetch('/user/unit', {
                method: 'put',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({userId, unitId})
            })
            // .then(data => data.json())
            .then(results => {
                // console.log(results)
                 resolve(results)})
            .catch(err => {
                // console.log(err)
                reject(err)
            })
        })
    }
}

export default DBService