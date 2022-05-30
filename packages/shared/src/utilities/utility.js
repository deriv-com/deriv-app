class PromiseClass {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}

module.exports = {
    PromiseClass,
};
