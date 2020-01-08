const getSettingFromLocal = () => {
    return JSON.parse(localStorage.getItem('dbot_settings'));
}

export const getSetting = key => {
    const settings = getSettingFromLocal();

    if(!settings) {
        return null;
    }

    return settings[key];
}

export const storeSetting = (key, value) => {
    const settings = getSettingFromLocal() || {};

    settings[key] = value;
    localStorage.setItem('dbot_settings', JSON.stringify(settings));
}