// AHAHAHAHAHAHAHAHAHHAHAHAHAHAHA


const reduceObjToLikeKeys = (arrOfObjs) => {
    const arrOfKeys = arrOfObjs.map(obj => Object.keys(obj));
    const commonKeys = arrOfKeys.reduce((acc, curr) => {
        return curr.filter(el => acc.includes(el));
    });
    const objectsWithLikeKeys = arrOfObjs.map(obj => commonKeys.map(key => obj[key]));

    const objectWithValsAsArray = {};
    commonKeys.forEach((key, keyIdx) => {
        objectWithValsAsArray[key] = [];
        objectsWithLikeKeys.forEach((likeKeyObj) => objectWithValsAsArray[key].push(likeKeyObj[keyIdx]));
    });


    return { arrWithLikeKeys: objectsWithLikeKeys, likeKeys: commonKeys, objectWithValsAsArray: objectWithValsAsArray };
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


    let headers = likeKeys.map(key => formattedString(key, longestStrInArray([key, ...objectWithValsAsArray[key]], 3)));
    console.log(headers);
    let divider = '';

    headers.forEach((header, idx) => divider += `${idx === 0 ? '+' : ''}${'-'.repeat(header.length)}+`);
    table += divider + '\n';
    headers.forEach((header, idx) => table += `${idx === 0 ? '|' : ''}${header}|`);
    table += '\n';
    arrWithLikeKeys.forEach((val, idx) => {
        let formattedVals = val.map((el, elIdx) => formattedString(el, longestStrInArray([likeKeys[elIdx], ...objectWithValsAsArray[likeKeys[elIdx]]], 3)));
        table += divider + '\n';
        table += `|${formattedVals.join('|')}|\n`;
    });
    table += divider;
    return table;

};


console.log(tableGenerator([
        {
            username: 'dalton',
            wordsTyped: 2,
            charsTyped: 28,
            imagesSent: 0,
            linksSent: 0
        },
        {
            username: 'Kagi',
            wordsTyped: 1,
            charsTyped: 8,
            imagesSent: 0,
            linksSent: 0
        }
    ]
));

// console.log(tableGenerator(
//     [
//         {
//             id: 1,
//             one: 'ssssssssomething',
//             two: 'somethingaksd',
//             three: 'test',
//         },
//         {
//             id: 2,
//             one: 'wowow',
//             two: 'woa',
//             three: 'aa',
//         },
//         {
//             id: 3,
//             one: 'nononno',
//             two: 'l',
//             three: 'l',
//             four: 'l',
//         },
//         {
//             id: 4,
//             one: 'nononno',
//             two: 'l',
//             three: 'l',
//             four: 'l',
//         },
//         {
//             id: 5,
//             one: 'testing',
//             two: 'lavva',
//             three: 'lasdasd;k',
//             four: 'l',
//         }
//     ]
// ));
//

