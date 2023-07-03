export const cryptoMathRandom = () => {
    const random_array = new Uint8Array(1);
    const random_value = crypto.getRandomValues(random_array)[0];
    return random_value / (Math.pow(2, 8) - 0.1);
};
