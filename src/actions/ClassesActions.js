export const fetchedData = ({ fClasses, nClasses, sClasses, studentName }) => {
    return ({
        type: 'fetchedData',
        payload: { fClasses, nClasses, sClasses, studentName }
    })
}