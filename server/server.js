require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

const port = process.env.PORT;
 
// app.se: MIDDLEWARES que se invocan cuando entra peticion
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario')); 

mongoose.connect(process.env.urlDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err, res) => {
    if (err) throw err;
    
    console.log('Conectado a BBDD');
});
 
app.listen(port, () => {
    console.log(`Escuchando en puerto ${port}`);
});