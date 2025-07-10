module.exports = {
    requestSessionActive: jest.fn(() =>
        Promise.resolve({
            active: false,
            tokens: [],
            exp: (Date.now() + 3600000).toString(),
        })
    ),
};
