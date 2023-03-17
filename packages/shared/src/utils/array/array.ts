export const shuffleArray = <T>(array: T[]): T[] => {
    function firstDigit(num: number) {
        const matches = String(num).match(/\d/) || '1';
        const digit = Number(matches[0]);
        return num < 0 ? -digit : digit;
    }

    for (let i = array.length - 1; i > 0; i--) {
        const crypto = window.crypto;
        const random_array = new Uint32Array(1);
        const random_number = crypto?.getRandomValues(random_array)[0];

        const j = Math.floor((firstDigit(random_number) / 10) * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
