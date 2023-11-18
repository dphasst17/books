import jwt from "jsonwebtoken";

export const verify  = (req,res,next) => {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) return res.sendStatus(401);
    const token = authorizationHeader.split(" ")[1];
    if (!token) res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
        if (err) res.sendStatus(403);
        req.idUser = data.id;
        next();
    });
}