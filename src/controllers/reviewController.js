import poolConnectDB from "../models/connectDB.js";
import * as review from "../models/reviewModel.js";
const pool = poolConnectDB();

export const insert = (req,res) => {
    const idUser = req.idUser;
    const data = req.body;
    const currentDate = new Date().toISOString().split('T')[0]
    const sql = review.insertReview(data.idBooks,idUser,data.review,data.vote,currentDate)
    pool.query(sql,(err,results) => {
        if (err) {
            res.status(500).json({
              status:500,
              message: "A server error occurred. Please try again in 5 minutes.",
            });
            return;
        }
        res.status(201).json({status:201,message:'Insert review success'})
    })
}
export const getAll = (req,res) => {
    const sql = review.getAllReview()
    pool.query(sql,(err,results) => {
        if (err) {
            res.status(500).json({
              status:500,
              message: "A server error occurred. Please try again in 5 minutes.",
            });
            return;
        }
        res.status(200).json({status:200,data:results.map(e => {
            return {
                ...e,
                data:JSON.parse(e.data)
            }
        })})
    })
}
export const getReviewByIdBooks = (req,res) => {
    const idBooks = req.params['idBooks'];
    const sql = review.getReviewByIdBooks(idBooks);
    pool.query(sql,(err,results) => {
        if (err) {
            res.status(500).json({
              status:500,
              message: "A server error occurred. Please try again in 5 minutes.",
            });
            return;
        }

        res.status(200).json({status:200,data:results.map(e => {
            const parseData = JSON.parse(e.data)
            return {
                ...e,
                rating:Number(e.rating).toFixed(1),
                data:parseData !== null ? parseData : []
            }
        })})
    })
}