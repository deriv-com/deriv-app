export default function workerJob(WorkerConstructor, ...params) {
    const webWorker = new WorkerConstructor();

    return new Promise((resolve, reject) => {
        webWorker.onmessage = event => {
            resolve(event.data);
        };

        webWorker.onerror = event => {
            reject(event.data);
        };

        webWorker.postMessage(params.map(param => JSON.stringify(param)));
    });
}
