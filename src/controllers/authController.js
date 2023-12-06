import poolConnectDB from "../models/connectDB.js";
import * as authQuery from "../models/authModel.js";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
const pool = poolConnectDB();

dotenv.config();

const updateLogin = (idUser, token) => {
    const sql = `UPDATE login SET refreshToken = '${token}' WHERE idUser = '${idUser}'`;
    pool.query(sql, function (err, results) {
        if (err) {
            res.status(500).json({
                status:500,
                message: "A server error occurred. Please try again in 5 minutes." 
            });
            return;
        }
    })
}

const createToken = (idUser) => {
    const accessToken = jwt.sign({ id: idUser }, process.env.SECRET_KEY, { expiresIn: "600s", });
    const refreshToken = jwt.sign({ id: `${idUser}-token` }, process.env.SECRET_KEY, { expiresIn: "5d" });
    const { exp: expAccess } = jwt.decode(accessToken);
    const { exp: expRefresh } = jwt.decode(refreshToken);
    updateLogin(idUser, refreshToken);
    return { accessToken, refreshToken, expAccess, expRefresh }
}

export const registerUser = (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;
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
            res.status(401).json({ status: 401, message: "Username is already taken" })
        }
        const currentDate = new Date().toISOString().split('T')[0];
        const saltRound = 10
        const salt = bcrypt.genSaltSync(saltRound);
        const pass_hash = bcrypt.hashSync(password, salt);
        const data = {
            username:username,
            pass_hash:pass_hash,
            role:role,
            date:currentDate
        }
        const insert = authQuery.register(data)
        pool.query(insert,(errInsert,resultsInsert) => {
            if (errInsert) {
                res.status(500).json({
                    status: 500,
                    message: "A server error occurred. Please try again in 5 minutes."
                })
                return
            }
            const addUser = authQuery.addUser(username);
            pool.query(addUser,(err,resultAdd) => {
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
            res.status(401).json({ status: 401, message: "Username does not exist" })
        }else{
            const pass_hash = results.map(e => e.password_hash).toString()
            isPassword = bcrypt.compareSync(password, pass_hash);
    
            if (!isPassword) {
                res.status(401).json({status:401, message:"Incorrect Password"})
            }else{
                const idUser = results.map(e => e.idUser).toString()
                const role = Number(results.map(e => e.role))
                const resultObj = createToken(idUser)
                resultObj.role = role;
                res.status(200).json({status:200,data:resultObj});
            }
        }
    })
}

export const adminLogin = (req,res) => {
    const data = req.body;
    const username = data.username;
    const password = data.password;
    const sql = authQuery.adminLogin(username);
    pool.query(sql,(err,results) => {
        let isPassword
        if (err) {
            res.status(500).json({
                err:err,
                status:500,
                message: "A server error occurred. Please try again in 5 minutes." 
            });
            return;
        }
        if(results.length === 0) {
            res.status(401).json({message:'Username does not exist'})
            return;
        }
        const pass_hash = results.map(e => e.password_hash).toString()
        isPassword = bcrypt.compareSync(password, pass_hash);
        if (!isPassword) {
            res.status(401).json({message: "Incorrect Password "});
            return;
        }
        const idUser = results.map(e => e.idUser).toString();
        const role = Number(results.map(e => e.role))
        const accessToken = jwt.sign({ id: idUser }, process.env.SECRET_KEY, { expiresIn: "1d" });
        const { exp: expAccess } = jwt.decode(accessToken);
        res.status(200).json({status:200,data:{accessToken:accessToken,exp:expAccess,role:role}});
    })

}
export const token = (req,res) => {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) return res.sendStatus(401);
    const token = authorizationHeader.split(" ")[1];
    if (!token) res.status(401).json({status:404,message:"Token does not exist"});

    jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
        if (err) {res.status(403).json({err:err,token:token,status:403,message:"Token has expired"});}
        let idUser = data.id;
        idUser = idUser.split("-")[0]
        const accessToken = jwt.sign({ id: idUser }, process.env.SECRET_KEY, { expiresIn: "600s", });
        const { exp: expAccess } = jwt.decode(accessToken);
        res.status(200).json({status:200,data:{ accessToken, expAccess }})
    });
}
export const forgotPass = (req,res) => {}
