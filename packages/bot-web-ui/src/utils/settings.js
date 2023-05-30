const getSettingsFromLocal = () => {
    return JSON.parse(localStorage.getItem('dbot_settings'));
};

export const getSetting = key => {
    const settings = getSettingsFromLocal();

    if (!settings) {
        return null;
    }

    return settings[key];
};

export const storeSetting = (key, value) => {
    const settings = getSettingsFromLocal() || {};

    settings[key] = value;
    localStorage.setItem('dbot_settings', JSON.stringify(settings));
};

export const removeKeyValue = key => {
    const settings = getSettingsFromLocal() || {};
    delete settings[key];

    localStorage.setItem('dbot_settings', JSON.stringify(settings));
};
