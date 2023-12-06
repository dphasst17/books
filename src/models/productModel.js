export const getAllProduct = (pages,limit,objFil) => {
    const start = (pages * limit)- limit;
    const sql = `SELECT * FROM books 
    ${objFil?.year ? `WHERE dateBooks = ${objFil?.year}` : ''} 
    ${objFil?.sort === 'true' ? (objFil?.typeSort && objFil?.valueSort ? `ORDER BY ${objFil?.valueSort} ${objFil?.typeSort}` :'ORDER BY price ASC') :''} 
    LIMIT ${start},${limit};`;
    return sql
}
export const getQuantityBooks = (year) => {
  const sql = `SELECT DISTINCT dateBooks,COUNT(idBooks)AS count FROM books ${year ? `WHERE dateBooks = '${year}'` :''} GROUP BY dateBooks ORDER BY dateBooks ASC;`;
  return sql
}
export const getDetail = (isbn) => {
  const sql = `SELECT b.*, COUNT(r.idReview)AS review_count, (SUM(r.vote) / CAST(COUNT(r.idReview)AS FLOAT)) AS average_score FROM books b LEFT JOIN reviews r ON b.idBooks = r.idBooks WHERE isbn = '${isbn}';`;
  return sql;
}
export const getNew = () => {
  const sql = `SELECT * FROM books ORDER BY price DESC LIMIT 0,6`
  return sql;
}