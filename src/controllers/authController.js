import poolConnectDB from "../models/connectDB.js";
import * as authQuery from "../models/authModel.js";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
const pool = poolConnectDB();

dotenv.config();

const createToken = (idUser) => {
    const accessToken = jwt.sign({ id: idUser }, process.env.SECRET_KEY, { expiresIn: "600s", });
    const refreshToken = jwt.sign({ id: `${idUser}-token` }, process.env.SECRET_KEY, { expiresIn: "5d" });
    const { exp: expAccess } = jwt.decode(accessToken);
    const { exp: expRefresh } = jwt.decode(refreshToken);
    updateLogin(idUser, refreshToken);
    return { accessToken, refreshToken, expAccess, expRefresh }
}

export const register = (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const sql = authQuery.login(username);
    pool.query(sql,(err,results) => {
        if (err) {
            res.status(500).json({
                status: 500,
                message: "A server error occurred. Please try again in 5 minutes."
            })
            return
        }
        if (results.length !== 0) {
            res.status(401).json({ status: 404, message: "Username is already taken" })
        }
        const insert = authQuery.register(username,password)
        pool.query(insert,(errInsert,resultsInsert) => {
            if (errInsert) {
                res.status(500).json({
                    status: 500,
                    message: "A server error occurred. Please try again in 5 minutes."
                })
                return
            }
            res.status(201).json({status:201,message:"Create account success"})
        })
    })
}

export const login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let isPassword;
    const sql = authQuery.login(username);
    pool.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({
                status: 500,
                message: "A server error occurred. Please try again in 5 minutes."
            })
            return
        }
        if (results.length === 0) {
            res.status(401).json({ status: 404, message: "Username does not exist" })
        }
        const pass_hash = results.map(e => e.password_hash).toString()
        isPassword = bcrypt.compareSync(password, pass_hash);

        if (!isPassword) {
            res.status(401).json("Incorrect Password ")
        }
        const idUser = results.map(e => e.idUser).toString()
        const role = Number(results.map(e => e.role))
        const resultObj = createToken(idUser)
        resultObj.role = role;
        res.status(200).json({status:200,data:resultObj});
    })
}

export const adminLogin = (req,res) => {
    const data = req.result;
    const username = data.username;
    const password = data.password;
    const sql = sqlQuery.adminLogin(username);
    pool.query(sql,(err,results) => {
        let isPassword
        if (err) {
            res.status(500).json({
                status:500,
                message: "A server error occurred. Please try again in 5 minutes." 
            });
            return;
        }
        if(results.length === 0) {
            res.status(401).json({message:'Username does not exist'})
        }
        const pass_hash = results.map(e => e.password_hash).toString()
        isPassword = bcrypt.compareSync(password, pass_hash);
        if (!isPassword) {
            res.status(401).json({message: "Incorrect Password "})
        }
        const idUser = results.map(e => e.idUser).toString();
        const role = Number(results.map(e => e.role))
        const accessToken = jwt.sign({ id: idUser }, process.env.SECRET_KEY, { expiresIn: "1d" });
        const { exp: expAccess } = jwt.decode(accessToken);
        res.status(200).json({accessToken:accessToken,exp:expAccess,role:role});
    })

}
export const token = (req,res) => {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) return res.sendStatus(401);
    const token = authorizationHeader.split("-")[0];
    if (!token) res.status(401).json({status:404,message:"Token does not exist"});

    jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
        if (err) res.status(403).json({status:403,message:"Token has expired"});
        let idUser = data.id;
        const accessToken = jwt.sign({ id: idUser }, process.env.SECRET_KEY, { expiresIn: "600s", });
        const { exp: expAccess } = jwt.decode(accessToken);
        res.status(200).json({ accessToken, expAccess })
    });
}
