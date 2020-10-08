const functions = require('firebase-functions');
const express = require("express")
const app = express();


var admin = require("firebase-admin");

var serviceAccount = require("./redesf-7ddb2-firebase-adminsdk-hykak-6dfca69c4f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://redesf-7ddb2.firebaseio.com"
});

const db = admin.firestore();
app.get('/', (req,res) => {
    return res.status(200).json({message: "Conexion del Servidor Correcta!"})
});

app.post('/createUser',async (req,res) => {
    try {
        await db.collection('users')
        .doc(req.query.id)
        .create({
            id: req.query.id,
            name: req.query.name,
            lastname: req.query.lastname,
            user: req.query.user,
            password: req.query.password,
            birthday: req.query.birthday,
            country: req.query.country,
            sex: req.query.sex
        });
    return res.status(200).json({message:"Insercion correcta"});
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    
});
app.get('/getAllUsers',async (req,res)=>{
     try {
        const query = db.collection('users');
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;
        const response = docs.map((doc) => ({
            id: doc.data().id,
            name: doc.data().name,
            lastname: doc.data().lastname,
            user: doc.data().user,
            password: doc.data().password,
            birthday: doc.data().birthday,
            country: doc.data().country,
            sex: doc.data().sex
        }))
        return res.status(200).json(response);
         
     } catch (error) {
        console.log(error);
        return res.status(500).send(error);
         
     }
});
app.get('/getAllUsersPerSex',async (req,res)=>{
    try {
       const query = db.collection('users');
       const querySnapshot = await query.get();
       const docs = querySnapshot.docs;
       const datos = docs.map((doc) => ({
            id: doc.data().id,
            name: doc.data().name,
            lastname: doc.data().lastname,
            user: doc.data().user,
            password: doc.data().password,
            birthday: doc.data().birthday,
            country: doc.data().country,
            sex: doc.data().sex
       }))
       const response = datos.filter(doc => doc.sex === req.body.sex);
       return res.status(200).json(response);return res.status(200).json(response);
        
    } catch (error) {
       console.log(error);
       return res.status(500).send(error);
        
    }
});
app.delete('/deleteUser', async (req,res) => {
    try {
        const document = db.collection('users').doc(req.query.id)
        await document.delete();
        return res.status(200).json({message:"Eliminacion correcta"});
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});
app.put('/updateUser', async (req,res) => {
    try {
        const document = db.collection('users').doc(req.query.id)
        await document.update({
            name: req.body.name,
            lastname: req.body.lastname,
            user: req.body.user,
            password: req.body.password,
            birthday: req.body.birthday,
            country: req.body.country,
            sex: req.body.sex
        });
        return res.status(200).json({message:"Actualizacion correcta"});
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});
exports.app = functions.https.onRequest(app);

