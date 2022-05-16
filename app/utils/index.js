export const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const getRandomResponse = (arr) => arr[randomBetween(0, arr.length)];
