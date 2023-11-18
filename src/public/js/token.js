let exp = localStorage.getItem("exp") || 0;
exp = Number(exp);
let expRf = localStorage.getItem("expRf") || 0;
expRf = Number(expRf);
const getCookie = (name) => {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
};
let checkCookie = getCookie('access');
let checkRf = getCookie('refresh');
const logOutCookie = (name) => {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const checkExpToken = async (e) => {
    if (exp && new Date().getTime() > new Date(exp * 1000).getTime()) {
        if (expRf && new Date().getTime() > new Date(expRf * 1000).getTime()) {
            localStorage.removeItem("isLogin")
            localStorage.removeItem("name")
        } else {
            let data = await getNewCookie(e, url);
            return data.accessToken;
        }
    } else {
        return checkCookie;
    }
}
async function getNewCookie(refresh, url) {
    let res = await fetch('api' + `${url}`, {
        headers: {
            Authorization: "Bearer " + refresh,
        }
    });
    let result = await res.json();
    handleSetCookie('access', result.accessToken, result.expAccess)
    localStorage.setItem("exp", result.expAccess);
    return result;
}
const handleSetCookie = (name, value, exp) => {
    let expires = "; expires=" + new Date(exp * 1000).toString();
    document.cookie = name + "=" + value + expires + "; path=/";
}