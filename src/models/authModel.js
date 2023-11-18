export const login = (username) => {
    const sql = `SELECT * FROM login WHERE username = ${username};`;
    return sql
}
export const register = (data) => {
    const sql = `INSERT INTO login(idUser,username,pass_hash,role,status,dateCreated)VALUES
    ('${data.username}','${data.username}','${data.pass_hash}',2,'activated','${data.date}');`
    return sql;
}
export const logout = (idUser) => {
    const sql = `UPDATE login SET refresh = '' WHERE idUser = '${idUser}';`
    return sql;
}
export const changePass = (idUser,newPass) => {
    const sql = `UPDATE login SET pass_hash = '${newPass}' WHERE idUser = '${idUser}';`;
    return sql;
}