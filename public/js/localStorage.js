const localCustom = (method,name,value) => {
    switch(method){
        case 'set':
            localStorage.setItem(name,JSON.stringify(value))
            
            break;
        case 'del':
            localStorage.removeItem(name)
            break;
        case 'clear':
            localStorage.clear();
            break;
        default:
            break;
    }
}
const getLocal = (name,exception) => {
    let result;
    result = JSON.parse(localStorage.getItem(name) || exception)
    return result;
}