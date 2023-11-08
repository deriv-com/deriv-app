import { getStoredItemsByKey, getStoredItemsByUser, setStoredItemsByKey } from 'Utils/session-storage';

describe('Session Storage Util', () => {
    const storageKey = 'example_key';
    const defaultValue = 'default_value';
    const storedItems = { example: 'data' };

    it('should return default value when storage is empty', () => {
        const result = getStoredItemsByKey(storageKey, defaultValue);
        expect(result).toBe(defaultValue);
    });

    it('should return default value when loginid is falsy', () => {
        const loginid = '123';
        const result = getStoredItemsByUser(storageKey, loginid, defaultValue);
        expect(result).toBe(defaultValue);
    });

    it('should set stored items', () => {
        setStoredItemsByKey(storageKey, storedItems);
        const result = getStoredItemsByKey(storageKey, defaultValue);
        expect(result).toStrictEqual(storedItems);
    });

    it('should throw error if invalid object is passed to store', () => {
        const consoleWarnMock = jest.fn();
        global.console.warn = consoleWarnMock;
        const circularObject = {
            circularReference: {},
        };
        circularObject.circularReference = circularObject;
        setStoredItemsByKey('example_key', circularObject);
        expect(consoleWarnMock).toHaveBeenCalled();
    });
});
