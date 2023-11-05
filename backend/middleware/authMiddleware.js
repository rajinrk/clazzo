const JWT = require('jsonwebtoken')


module.exports = async (req, res, next) => {
    try {
        const decode = JWT.verify(
            req.headers.authorization,
            'clazzoInnovations'
        );
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:error
        })
    }
};