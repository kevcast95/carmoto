const INITIALSTATE = {
    idUser: "",
    userLogged: {},
    logedIn: false,
    
}

export default function(state= INITIALSTATE, action) {
    const { type, payload } = action;

    switch(type) {
        case 'SET_ID_USER':
            return { ...state, idUser: payload }
        case 'SET_USER_LOGGED':
            return{...state, userLogged: payload}
        case 'LOGED_IN':
            return{...state, logedIn: payload}
        default:
            return state
    }
}