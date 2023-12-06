import poolConnectDB from "../models/connectDB.js";
import * as product from "../models/productModel.js"
const pool = poolConnectDB();

export const viewProduct = (req,res) => {
    if (req.path === '/product') {
        res.render("./layout/index", {url: "/product"});
    } else if (req.path === '/admin/product') {
        res.render("./layout/admin",{url:'/product'});
    }
}
export const viewDetail = (req,res) => {
    const isbn = req.params['isbn'];
    const sql = product.getDetail(isbn);
    pool.query(sql,(err,results) => {
        if (err) {
            res.status(500).json({
                status:500,
                message: "A server error occurred. Please try again in 5 minutes.",
            });
            return;
        }
        const isNull = results.every(c => c.idBooks === null)
        if(isNull){
            res.render("./layout/index",{url:"/404"})
        }else{

            let name = results.map(e => e.name)
            let idBooks = results.map(e => e.idBooks)
    
            res.render("./layout/index",{url:"/detail",idBooks:idBooks,name:name,data:results})
        }
    })
}
export const index = (req,res) => {
    const currentPage = Number(req.query.pages) || 1
    const limit = Number(req.query.limit) || 15
    const year = Number(req.query.year) || null
    const sort = req.query.sort || false
    let objFil = {
        year : year !== null ? year : false ,
        sort : sort,
        typeSort: sort ? req.query.typeSort : false,
        valueSort:sort ? req.query.valueSort : false
    }
    objFil = Object.fromEntries(Object.entries(objFil).filter(([key, value]) => value !== false));
    const sql = product.getAllProduct(currentPage,limit,Object.keys(objFil).length !== 0 ? objFil:'')
    const getCount = product.getQuantityBooks(year !== null ? year : '')
    pool.query(getCount,(err,result1) => {
        if (err) {
            res.status(500).json({
                err1:err,
                status:500,
                message: "A server error occurred. Please try again in 5 minutes.",
            });
            return;
        }
        const totalProduct = result1.map(e => e.count).reduce((a,b) => a+b)
        const filYear = result1.map(e => e.dateBooks)
        pool.query(sql,(err,results) => {
            if (err) {
                res.status(500).json({
                  status:500,
                  message: "A server error occurred. Please try again in 5 minutes.",
                });
                return;
            }
            let countPage = totalProduct > limit ? (totalProduct % limit === 0 ? totalProduct / limit : (totalProduct/limit) + 1) : 1
            res.status(200).json({status:200,data:results,countPage:countPage,pages:currentPage,filterYear:filYear})
        })
    })
}
export const add = (req,res) => {
    res.render("./layout/index",{url:"/add"})
}
export const detail = (req,res) => {
    const isbn = req.params['isbn'];
    const sql = product.getDetail(isbn);
    pool.query(sql,(err,results) => {
        if (err) {
            res.status(500).json({
                err1:err,
                status:500,
                message: "A server error occurred. Please try again in 5 minutes.",
            });
            return;
        }
        const isNull = results.every(c => c.idBooks === null)
        if(isNull ){
            res.status(404).json({status:404,message:"No data result"})
        }else{

            res.status(200).json({status:200,data:results.map(e => {
                return {
                    ...e,
                    average_score:Number(e.average_score)
                }
            })})
        }
    })
}
export const getNew = (req,res) => {
    const sql = product.getNew()
    pool.query(sql,(err,results) => {
        if (err) {
            res.status(500).json({
                err1:err,
                status:500,
                message: "A server error occurred. Please try again in 5 minutes.",
            });
            return;
        }
        res.status(200).json({status:200,data:results})
    })
}