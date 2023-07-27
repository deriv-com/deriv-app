import _Symbol from '../common/symbolApi';

export const symbolApi = new _Symbol();

export const symbolPromise = new Promise(resolve => {
    symbolApi.initPromise.then(() => {
        resolve();
    });
});
