let static_hash: string;
export const getStaticHash = () => {
    static_hash =
        static_hash || (document.querySelector('script[src*="main"]')?.getAttribute('src') || '').split('.')[1];
    return static_hash;
};

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
