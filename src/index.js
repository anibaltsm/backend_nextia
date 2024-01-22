const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Ruta al archivo JSON de credenciales
const serviceAccountPath = path.join(__dirname, 'config', 'nextiatest-c8159-firebase-adminsdk-ak62e-3a9564e41a.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://nextiatest-c8159.firebaseio.com',
});

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('¡Hola desde Express!');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

app.get('/checkFirebaseConnection', (req, res) => {
    admin.auth().listUsers(10) 
        .then((listUsersResult) => {
            console.log('Conexión exitosa con Firebase');
            res.send('Conexión exitosa con Firebase');
        })
        .catch((error) => {
            console.error('Error en la conexión con Firebase:', error);
            res.status(500).send('Error en la conexión con Firebase');
        });
});
