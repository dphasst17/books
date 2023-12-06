
let exp = getLocal('expAccess','0')
exp = Number(exp);
let expRf = getLocal('expRefresh','0')
expRf = Number(expRf);
const getCookie = (name) => {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
};
let accessToken = getCookie('access');
let refreshToken = getCookie('refresh');
const getToken = async () => {
    if(exp && new Date().getTime() < new Date(exp * 1000).getTime()){
        return accessToken;
    }else{
        if(expRf && new Date().getTime() < new Date(expRf * 1000).getTime()){
            let data = await getNewCookie(refreshToken);
            return data.accessToken;
        }else{
            localCustom('clear');
            window.location.href="/login"
        }
    }
}
const getNewCookie = async(refresh) => {
    let res = await fetch('/auth/token', {
        method:'POST',
        headers: {
            'Authorization': "Bearer " + refresh,
        }
    });
    let result = await res.json();
    handleSetCookie('access', result.data.accessToken, result.data.expAccess)
    localCustom('set','expAccess',result.data.expAccess)
    return result.data;
}
const handleSetCookie = (name, value, exp) => {
    let expires = "; expires=" + new Date(exp * 1000).toString();
    document.cookie = name + "=" + value + expires + "; path=/";
}

const deleteCookie = (name) => {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
}