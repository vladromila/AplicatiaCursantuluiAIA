const INITIAL_STATE = { fClasses: [], nClasses: [], sClasses: [], studentName: '' }

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'fetchedData':
            return { ...state, fClasses: action.payload.fClasses || [], nClasses: action.payload.nClasses || [], sClasses: action.payload.sClasses || [], studentName: action.payload.studentName }
        default:
            return state;
    }
}