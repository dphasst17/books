import mysql from 'mysql2';
import dotenv from "dotenv";
dotenv.config();
const poolConnectDB = () => {
    let pool = mysql.createPool({
        connectionLimit : 10,
        host :process.env.HOST,
        user:process.env.USER,
        password:process.env.PASSWORD,
        database:process.env.DB
    });
    return pool
}
export default poolConnectDB