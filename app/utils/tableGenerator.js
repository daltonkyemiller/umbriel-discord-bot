const reduceObjToLikeKeys = (arrOfObjs) => {
    let arrOfKeys = arrOfObjs.map(obj => Object.keys(obj));
    let commonKeys = arrOfKeys.reduce((acc, curr) => {
        return curr.filter(el => acc.includes(el));
    });

    let objectsWithLikeKeys = arrOfObjs.map(obj => commonKeys.map(key => obj[key]));
    let objectOfValuesInOrder = {};

    return { arrWithLikeKeys: objectsWithLikeKeys, likeKeys: commonKeys };
};


export const tableGenerator = (arr) => {
    let { arrWithLikeKeys, likeKeys } = reduceObjToLikeKeys(arr);
    let allStrs = likeKeys.concat(...arrWithLikeKeys.map(obj => Object.values(obj)));
    let longestStrLength = Math.max(...allStrs.map(str => String(str).length)) + 2;
    let table = '';

    const formattedString = (string, length) => {
        let whiteSpaceLeft = ' '.repeat(Math.ceil((length - string.length) / 2));
        let whiteSpaceRight = ' '.repeat((length - string.length) / 2);
        return whiteSpaceLeft + string + whiteSpaceRight;
    };


    let headers = likeKeys.map(key => formattedString(key, longestStrLength));
    let objs = arrWithLikeKeys.map(obj => Object.values(obj).map(val => formattedString(String(val), longestStrLength)));


    headers.forEach((header, idx) => table += `${idx === 0 ? '+' : ''}${'-'.repeat(header.length)}+`);
    table += '\n';
    headers.forEach((header, idx) => table += `${idx === 0 ? '|' : ''}${header}|`);
    table += '\n';
    objs.forEach((obj, idx) => table += `|${obj.join('|')}|\n`);

    return table;

};

console.log(tableGenerator(
    [
        {
            id: 1,
            one: 'something',
            three: 'test',
            two: 'somethingaksd',
        },
        {
            id: 2,
            one: 'wowow',
            two: 'woa',
            three: 'aa',
        },
        {
            id: 3,
            one: 'nononno',
            two: 'l',
            three: 'l',
            four: 'l',
        },
        {
            id: 4,
            one: 'nononno',
            two: 'l',
            three: 'l',
            four: 'l',
        },
        {
            id: 5,
            one: 'testing',
            two: 'lavva',
            three: 'lasdasd;k',
            four: 'l',
        }
    ]
));


