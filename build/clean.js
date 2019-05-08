module.exports = {
    all: {
        src: global.path ? 'DummyPath' : global.dist, // DummyPath used to prevent deleting files when --path option specified
    }
};
