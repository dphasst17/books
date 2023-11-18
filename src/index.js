import express from "express";
import dotenv from "dotenv";
import productRouter from "./router/productRouter.js"
import path from "path";
import { fileURLToPath } from 'url';
const app = express();
const PORT = process.env.PORT || 3030;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
//Config cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use('/public', express.static(path.resolve(path.join(__dirname, './public')))); 
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.get("/", (req, res) => {
  res.render("./layout/index",{url:"/"});
});
app.get("/login", (req, res) => {
  res.render("./layout/index",{url:"/login"});
});
app.get("/register", (req, res) => {
  res.render("./layout/index",{url:"/register"});
});
app.use("/",productRouter)


app.get("/contact",(req,res) => {
  res.render("./layout/index",{url:"/contact"})
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  
