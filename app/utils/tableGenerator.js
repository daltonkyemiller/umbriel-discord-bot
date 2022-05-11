// THIS ONE HURT ME


/**
 * It takes an array of objects and returns an object with the keys of the objects that are the same and the values of
 * those keys as an array of the values of those keys
 * @param arrOfObjs - an array of objects
 * @returns An object with three properties:
 *     arrWithLikeKeys: an array of arrays, each sub-array containing the values of the like keys
 *     likeKeys: an array of the like keys
 *     objectWithValsAsArray: an object with the like keys as properties and the values as arrays of the values of the like
 * keys
 */
const reduceObjToLikeKeys = (arrOfObjs) => {
    const arrOfKeys = arrOfObjs.map(obj => Object.keys(obj));
    const likeKeys = arrOfKeys.reduce((acc, curr) => {
        return curr.filter(el => acc.includes(el));
    });
    const arrWithLikeKeys = arrOfObjs.map(obj => likeKeys.map(key => obj[key]));

    const objectWithValsAsArray = {};
    likeKeys.forEach((key, keyIdx) => {
        objectWithValsAsArray[key] = [];
        arrWithLikeKeys.forEach((likeKeyObj) => objectWithValsAsArray[key].push(likeKeyObj[keyIdx]));
    });


    return {
        arrWithLikeKeys: arrWithLikeKeys,
        likeKeys: likeKeys,
        objectWithValsAsArray: objectWithValsAsArray
    };
};


export const tableGenerator = (arr) => {
    const { arrWithLikeKeys, likeKeys, objectWithValsAsArray } = reduceObjToLikeKeys(arr);
    let table = '\n';

    const longestStrInArray = (arr, padding = 0) => Math.max(...arr.map(str => String(str).length)) + padding;


    const formattedString = (string, length) => {
        string = String(string);
        let whiteSpaceLeft = ' '.repeat(Math.ceil((length - string.length) / 2));
        let whiteSpaceRight = ' '.repeat((length - string.length) / 2);
        return whiteSpaceLeft + string + whiteSpaceRight;
    };

    const tablePadding = 0;
    let headers = likeKeys.map(key => formattedString(key, longestStrInArray([key, ...objectWithValsAsArray[key]], tablePadding)));
    let divider = '';

    // Formatting divider
    headers.forEach((header, idx) => divider += `${idx === 0 ? '+' : ''}${'-'.repeat(header.length)}+`);

    // Adding a divider and newline character to top of table
    table += divider + '\n';
    headers.forEach((header, idx) => table += `${idx === 0 ? '|' : ''}${header}|`);
    table += '\n';
    arrWithLikeKeys.forEach((val, idx) => {
        const formattedVals = val.map((el, elIdx) => formattedString(el, longestStrInArray([likeKeys[elIdx], ...objectWithValsAsArray[likeKeys[elIdx]]], tablePadding)));
        table += divider + '\n';
        table += `|${formattedVals.join('|')}|\n`;
    });
    table += divider;
    return table;

};

