export const millisecondsToTimer = (milliseconds) => {
    const length = 2;
    const pad = '0';

    return `${ (new Array(length + 1).join(pad) + ((milliseconds / 60) / 1000)).slice(-length) }:${ (new Array(length + 1).join(pad) + (milliseconds / 1000)).slice(-length) }`;
};
