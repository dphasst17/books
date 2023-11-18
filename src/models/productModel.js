export const getAllProduct = (pages,limit,objFil) => {
    const start = (pages * limit)- limit;
    const sql = `SELECT * FROM books 
    ${objFil?.year ? `WHERE dateBooks = ${objFil?.year}` : ''} 
    ${objFil?.sort === 'true' ? (objFil?.typeSort && objFil?.valueSort ? `ORDER BY ${objFil?.valueSort} ${objFil?.typeSort}` :'ORDER BY price ASC') :''} 
    LIMIT ${start},15;`;
    return sql
}
export const getQuantityBooks = (year) => {
  const sql = `SELECT DISTINCT dateBooks,COUNT(idBooks)AS count FROM books ${year ? `WHERE dateBooks = '${year}'` :''} GROUP BY dateBooks ORDER BY dateBooks ASC;`;
  return sql
}
export const getDetail = (isbn) => {
  const sql = `SELECT * FROM books WHERE isbn = '${isbn}';`;
  return sql;
}