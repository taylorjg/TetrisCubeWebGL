export const range = n => Array.from(Array(n).keys());

export const shuffle = xs => {
    const len = xs.length;
    for (let i = 0; i < len - 1; i++) {
        const j = getRandomArbitrary(i, len);
        const tmp = xs[i];
        xs[i] = xs[j];
        xs[j] = tmp;
    }
};

const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
