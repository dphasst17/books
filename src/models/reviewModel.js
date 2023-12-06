export const getAllReview = () =>{
    const sql = `SELECT COUNT(*)AS total, 
    CONCAT('[',GROUP_CONCAT(JSON_OBJECT('idReview',r.idReview,'idBooks',r.idBooks,'name',u.name,'review',r.review,'vote',r.vote,'date',r.dateReview) ORDER BY r.dateReview DESC),']')AS data 
    FROM reviews r 
    LEFT JOIN users u ON r.idUser = u.idUser`;
    return sql;
}
export const getReviewByIdBooks = (idBooks) => {
    const sql = `SELECT COUNT(*)AS total, (SUM(r.vote) / COUNT(r.vote))AS rating,
    CONCAT('[',GROUP_CONCAT(JSON_OBJECT('idReview',r.idReview,'idBooks',r.idBooks,'name',u.name,'review',r.review,'vote',r.vote,'date',r.dateReview) ORDER BY r.dateReview DESC),']')AS data 
    FROM reviews r 
    LEFT JOIN users u ON r.idUser = u.idUser
    WHERE idBooks = ${idBooks};`;
    return sql;
}
export const insertReview = (idBooks,idUser,review,vote,currentDate) => {
    const sql = `INSERT INTO reviews(idBooks,idUser,review,vote,dateReview)VALUES(${idBooks},'${idUser}','${review}',${vote},'${currentDate}');`;
    return sql;
}
export const deleteReview = () => {
    const sql = ``;
    return sql;
}