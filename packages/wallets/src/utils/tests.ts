let originalLocalStorage: Storage;
const localStorageMock: Storage = {
    clear() {
        this.store = {};
    },
    getItem(key) {
        return this.store[key];
    },
    key() {
        return 'test key';
    },
    length: 0,
    removeItem(key) {
        delete this.store[key];
    },
    setItem(key, value) {
        this.store[key] = value.toString();
    },
    store: {},
};

export const mockLocalStorageBeforeEachTest = () => {
    originalLocalStorage = global.localStorage;
    Object.defineProperty(global, 'localStorage', { value: localStorageMock });
};

export const restoreLocalStorageAfterEachTest = () => {
    Object.defineProperty(global, 'localStorage', { value: originalLocalStorage });
};
