const jwt = require('jsonwebtoken');

// ---------------------------------
//  Verifica token
// ---------------------------------

let verificaToken = (req, res, next) => {

    let token = req.get('Authorization'); // Authorization

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();

    })

};


// ---------------------------------
//  Verifica ADMIN_ROLE
// ---------------------------------

let verificaRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no tiene privilegios suficientes'
            }
        });
    } 

    next();

}

module.exports = { 
    verificaToken,
    verificaRole
}