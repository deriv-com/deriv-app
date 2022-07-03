export const createError = (name, message) => {
    const e = new Error(message);
    e.name = name;
    e.code = name;
    return e;
};
