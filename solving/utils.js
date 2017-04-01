export const range = n => Array.from(Array(n).keys());
export const flatten = xss => xss.reduce((acc, xs) => acc.concat(xs), []);
