const valueLogin = document.getElementById('loginValues') 
const isLogin = getLocal('userLogin','false');
isLogin === true ? valueLogin.innerText = 'Logout' : valueLogin.innerText = 'Login';

const handleLogin = () => {
    if(valueLogin.textContent === 'Login'){
        window.location.href="/login"
    }else{
        localCustom('clear');
        deleteCookie('access');
        deleteCookie('refresh')
        window.location.href="/login"
    }
}