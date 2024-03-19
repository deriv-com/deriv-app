// to use this localStorage mock, add the following import statement to the test file:
// import 'Utils/mock/mock-local-storage';

let store: Record<string, string> = {};

export const mockLocalStorage = (() => {
    return {
        getItem(key: string) {
            return store[key] || null;
        },
        setItem(key: string, value: string) {
            store[key] = value.toString();
        },
        clear() {
            store = {};
        },
        removeItem(key: string) {
            delete store[key];
        },
    };
})();
