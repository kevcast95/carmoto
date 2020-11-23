const INITIALSTATE = {
    idUser: "no hay ID",
    roleUser: "false",
    
}

export default function(state= INITIALSTATE, action) {
    const { type, payload } = action;

    switch(type) {
        case 'SET_ID_USER':
            return { ...state, idUser: payload }
        case 'SET_ROLE_USER':
            return{...state, roleUser: payload}
        default:
            return state
    }
}