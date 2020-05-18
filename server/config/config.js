// ===========================
// Puerto
// ===========================

process.env.PORT = process.env.PORT || 3000;

// ===========================
// Entorno
// ===========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================
// BBDD
// ===========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB='mongodb://localhost:27017/cafe'
} else {
    urlDB='mongodb+srv://r22k:CtX6W4UBCAPebdO8@cluster0-5ghjw.mongodb.net/cafe?retryWrites=true&w=majority'
}

process.env.urlDB = urlDB;