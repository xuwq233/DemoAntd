const initState = {
    value:"initial state value"
}
const rootReducer = (state, action) => {
    switch(action.type){
        case "send":
            return Object.assign({}, state, action);
        
        default:
            return state;
    }
}

export default rootReducer