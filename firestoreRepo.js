const fa = require('firebase-admin')
const serviceAccount = require('./softtecobot-f4439-firebase-adminsdk-m8q66-6425f2cbd3.json');

fa.initializeApp({
    credential: fa.credential.cert(serviceAccount)
})

const firestore = fa.firestore();

class FirestoreRepo {  
    async addClient(client) {
        try {
            const result = await firestore.collection('Clients').add(client); 
        } catch (e) {
            console.log(e)
        }
    }
    async addOrder(order) {
        try {
            const result = await firestore.collection('Orders').add(order); 
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new FirestoreRepo()