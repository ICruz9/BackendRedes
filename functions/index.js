const functions = require('firebase-functions');
const express = require("express")
const app = express();


var cors = require ('cors');
app.use(cors({
    origin:['http://localhost:8080','http://localhost:5000/redesf-7ddb2/us-central1/app'],
    credentials:true
}));

app.use(function (req, res, next) {

  res.header('Access-Control-Allow-Origin', "http://localhost:8080");
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});


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
        var obj = JSON.parse(req.body);
        console.log(obj.id);
        await db.collection('users')
        .doc(obj.id)
        .create({
            id: obj.id,
            name: obj.name,
            lastname: obj.lastname,
            user: obj.user,
            password: obj.password,
            birthday: obj.birthday,
            country: obj.country,
            sex: obj.sex
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
app.post('/signIn',async (req,res)=>{
    try {
        console.log(req.body);
        var obj = JSON.parse(req.body);
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
        const response = datos.filter(doc => doc.user === obj.user && doc.password === obj.password);
        console.log(response.length);
        if (response.length===1) {
            const resp =  {'signIn':'true'}
            return res.status(200).json(resp);  
        }else{
            const resp =  {'signIn':'false'}
            return res.status(200).json(resp);
        }
       
        
    } catch (error) {
       console.log(error);
       return res.status(500).send(error);
        
    }
});
app.post('/getAllUsersPerSex',async (req,res)=>{
    try {
       var obj = JSON.parse(req.body);
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
       const response = datos.filter(doc => doc.sex === obj.sex);
       return res.status(200).json(response);
    } catch (error) {
       console.log(error);
       return res.status(500).send(error);
        
    }
});
app.delete('/deleteUser', async (req,res) => {
    try {
        var obj = JSON.parse(req.body);
        const document = db.collection('users').doc(obj.id)
        await document.delete();
        return res.status(200).json({message:"Eliminacion correcta"});
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});
app.put('/updateUser', async (req,res) => {
    try {
        var obj = JSON.parse(req.body);
        const document = db.collection('users').doc(obj.id)
        await document.update({
            name: obj.name,
            lastname:obj.lastname,
            user: obj.user,
            password: obj.password,
            birthday: obj.birthday,
            country: obj.country,
            sex: obj.sex
        });
        return res.status(200).json({message:"Actualizacion correcta"});
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});
exports.app = functions.https.onRequest(app);

