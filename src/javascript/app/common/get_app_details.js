const localize = require('../../_common/localize').localize;
const getAppId = require('../../config').getAppId;

const buildOauthApps = (response) => {
    if (!response || !response.oauth_apps) return {};
    const obj_oauth_apps = { 2: 'Binary.com Autoexpiry' };
    response.oauth_apps.forEach((app) => {
        obj_oauth_apps[app.app_id] = app.name;
    });
    return obj_oauth_apps;
};

const addTooltip = (oauth_apps) => {
    Object.keys(oauth_apps).forEach((key) => {
        const tooltip_text = addAppIdName(key, oauth_apps[key]);
        if (tooltip_text) {
            $(`.${key}`).attr('data-balloon', tooltip_text);
        }
    });
};

const addAppIdName = (app_id, app_name) => (
    +app_id === +getAppId() ? '' : localize('Transaction performed by [_1] (App ID: [_2])', [app_name || '', app_id])
);

const showTooltip = (app_id, oauth_app_id) => {
    const tooltip_text = addAppIdName(app_id, oauth_app_id);
    const tooltip_attr = tooltip_text ? `data-balloon="${tooltip_text}"` : '';
    return app_id ? ` class="${app_id}" ${tooltip_attr}` : '';
};

module.exports = {
    buildOauthApps,
    addTooltip,
    addAppIdName,
    showTooltip,
};
