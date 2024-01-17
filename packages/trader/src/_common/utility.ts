export class PromiseClass {
    promise: Promise<unknown>;
    reject?: (reason?: unknown) => void;
    resolve?: (value?: unknown) => void;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}
