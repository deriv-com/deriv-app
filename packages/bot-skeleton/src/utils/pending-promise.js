export default function PendingPromise() {
    let resolve, reject;

    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });

    promise.isPending = true;

    promise.resolve = res => {
        promise.isPending = false;
        resolve(res);
    };

    promise.reject = error => {
        promise.isPending = false;
        reject(error);
    };

    return promise;
}
