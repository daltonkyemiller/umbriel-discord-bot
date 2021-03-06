export const flattenObj = (obj, parent, res = {}) => {
    for (const key of Object.keys(obj)) {
        const propName = key;
        if (typeof obj[key] === 'object') {
            flattenObj(obj[key], propName, res);
        } else {
            res[propName] = obj[key];
        }
    }
    return res;
};
