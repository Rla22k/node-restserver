// ===========================
// Puerto
// ===========================

process.env.PORT = process.env.PORT || 3000;

// ===========================
// Entorno
// ===========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================
// Vencimiento Token
// ===========================
/** s*min*h*d */

process.env.caducidadToken = 1000*60*60*24*30;


// ===========================
// SEED
// ===========================

process.env.SEED = process.env.SEED | 'seed-desarrollo';

// ===========================
// BBDD
// ===========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB='mongodb://localhost:27017/cafe'
} else {
    urlDB=process.env.MONGO_URI;
}

process.env.urlDB = urlDB;

// ===========================
// Google ClientID
// ===========================

process.env.CLIENT_ID = '14081411257-767rqfik7ie3r7qa11qbjhdo62gtlpbs.apps.googleusercontent.com';

