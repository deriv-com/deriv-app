module.exports = {
    serve: {
        tasks  : ['webpack:watch', 'watch'],
        options: {
            logConcurrentOutput: true
        }
    }
};
