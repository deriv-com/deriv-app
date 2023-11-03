import { getSetting, storeSetting, removeKeyValue } from '../settings';

describe('Settings functions: getSetting(), storeSetting(), removeKeyValue()', () => {
    it('Should return null if there are no settings', () => {
        expect(getSetting('someKey')).toBe(null);
    });

    it('Should store and retrieve a setting', () => {
        storeSetting('testKey', 'testValue');

        expect(getSetting('testKey')).toBe('testValue');
    });

    it('Should remove a key-value pair from settings', () => {
        storeSetting('testKey', 'testValue');

        removeKeyValue('testKey');

        expect(getSetting('testKey')).toBe(undefined);
    });

    it('Should handle removing a key when dbot_settings does not exist and settings is an empty object', () => {
        localStorage.removeItem('dbot_settings');
        removeKeyValue('testKey');

        expect(localStorage.getItem('dbot_settings')).toBe(JSON.stringify({}));
    });
});
