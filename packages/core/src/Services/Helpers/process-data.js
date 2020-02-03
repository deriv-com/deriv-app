/**
 * Converts oauth_apps response to an object
 *
 * @param  {Object} response of oauth_apps request
 * @return {Object} returns an object containing application ids alongside their name { app_id: name }
 */
export const getOauthAppsObject = (response = {}) =>
    (response.oauth_apps || []).reduce((acc, app) => ({ ...acc, ...{ [app.app_id]: app.name } }), {
        2: 'Binary.com Autoexpiry',
    });
