export const login = (username) => {
    const sql = `SELECT * FROM login WHERE username = '${username}';`;
    return sql
}
export const adminLogin = (username) => {
    const sql = `SELECT * FROM login WHERE username = '${username}' AND role != 2;`;
    return sql;
}
export const register = (data) => {
    const sql = `INSERT INTO login(idUser,username,password_hash,role,refreshToken,status,dateCreated)VALUES
    ('${data.username}','${data.username}','${data.pass_hash}',2,'','activated','${data.date}');`
    return sql;
}
export const addUser = (username) => {
    const sql = `INSERT INTO users(idUser,name,phone,email)VALUES('${username}','${username}','','');`;
    return sql;
}
export const logout = (idUser) => {
    const sql = `UPDATE login SET refreshToken = '' WHERE idUser = '${idUser}';`
    return sql;
}
export const updateToken = (idUser,refresh) => {
    const sql = `UPDATE login SET refreshToken = '${refresh}' WHERE idUser = '${idUser}';`
}
export const changePass = (idUser,newPass) => {
    const sql = `UPDATE login SET pass_hash = '${newPass}' WHERE idUser = '${idUser}';`;
    return sql;
}