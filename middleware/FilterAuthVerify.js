const jwt = require("jsonwebtoken");

const filter = async (req, res, next) => {
// 


    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).send({ message: "Authorization required" });
    }
    const token = authorization.split(" ")[1];

    if (req.query.tokenOf ==='admin') {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            next();
        } catch (error) {
            return res.status(401).send({ message: "Invalid Authorization" });
        }
    } else if(req.query.tokenOf ==='vendor') {
        try {
             jwt.verify(token, process.env.VENDOR_JWT_SECRET);
            
            next();
        } catch (error) {
            return res.status(401).send({ message: "Invalid Authorization" });
        }
    }else if(req.query.tokenOf ==='cycle'){
        
            next();
    }else if(req.query.tokenOf ==='user_order'){
        try {
             jwt.verify(token, process.env.USER_JWT_SECRET);
            next();
        } catch (error) {
            return res.status(401).send({ message: "Invalid Authorization" });
        }
    }else{
        return res.status(401).send({ message: "Invalid Authorization" });
    }


};


module.exports = filter
