const expect        = require('chai').expect;
const GetAppDetails = require('../get_app_details');
const getAppId      = require('../../../config').getAppId;

const oauth_apps_response = { echo_req: { oauth_apps: 1, passthrough: {}, req_id: 12 }, msg_type: 'oauth_apps', oauth_apps: [{ app_id: '1261', app_markup_percentage: '0', last_used: '2017-06-23 02:05:46', name: 'Binary Bot Beta', scopes: ['read', 'trade'] }, { app_id: '1', app_markup_percentage: '0', last_used: '2017-06-23 02:05:49', name: 'Binary.com', scopes: ['read', 'admin', 'trade', 'payments'] }, { app_id: '1426', app_markup_percentage: '0', last_used: '2017-06-08 08:57:32', name: 'binary-com kelly', scopes: ['read', 'trade', 'payments', 'admin'] }, { app_id: '1097', app_markup_percentage: '0', last_used: '2017-06-23 01:54:55', name: 'Binary-Hamedanchi', scopes: ['read', 'admin', 'trade', 'payments'] }, { app_id: '1098', app_markup_percentage: '0', last_used: '2017-06-22 22:45:04', name: 'Binary-Staging', scopes: ['read', 'admin', 'trade', 'payments'] }, { app_id: '1159', app_markup_percentage: '0', last_used: '2017-06-23 01:02:38', name: 'Binary Static localhost for dev', scopes: ['read', 'trade', 'payments', 'admin'] }, { app_id: '2472', app_markup_percentage: '0', last_used: '2017-06-23 02:05:30', name: 'Champion FX', scopes: ['read', 'trade', 'payments', 'admin'] }, { app_id: '2571', app_markup_percentage: '0', last_used: '2017-03-31 07:50:22', name: 'champion-static', scopes: ['read', 'trade', 'payments', 'admin'] }, { app_id: '1288', app_markup_percentage: '0', last_used: '2017-06-23 02:05:48', name: 'MT-Binary', scopes: ['read', 'trade', 'payments', 'admin'] }, { app_id: '1164', app_markup_percentage: '0', last_used: '2016-12-28 02:01:29', name: 'negar-binary', scopes: ['read', 'trade', 'payments', 'admin'] }, { app_id: '1257', app_markup_percentage: '0', last_used: '2017-06-23 02:05:49', name: 'negarn', scopes: ['read', 'trade', 'payments', 'admin'] }, { app_id: '11', app_markup_percentage: '0', last_used: '2017-06-23 02:05:44', name: 'Webtrader', scopes: ['read', 'trade', 'payments', 'admin'] }, { app_id: '1086', app_markup_percentage: '0', last_used: '2017-06-22 10:33:15', name: 'webtrader beta', scopes: ['read', 'trade', 'payments', 'admin'] }], passthrough: {}, req_id: 12 };

describe('GetAppDetails', () => {
    describe('.buildOauthApps()', () => {
        it('works as expected', () => {
            const oauth_apps = GetAppDetails.buildOauthApps(oauth_apps_response);
            expect(oauth_apps).to.be.an('object');
            expect(oauth_apps[2]).to.equal('Binary.com Autoexpiry');
            expect(oauth_apps[1261]).to.equal('Binary Bot Beta');
        });
        it('works for empty response', () => {
            expect(GetAppDetails.buildOauthApps({})).to.be.an('object').that.is.empty;
            expect(GetAppDetails.buildOauthApps(undefined)).to.be.an('object').that.is.empty;
        });
    });

    describe('.addAppIdName()', () => {
        it('works as expected', () => {
            expect(GetAppDetails.addAppIdName(2, 'Binary.com')).to.equal('Transaction performed by Binary.com (App ID: 2)');
        });
        it('doesn\'t show for same app id as current', () => {
            expect(GetAppDetails.addAppIdName(getAppId(), 'Binary.com')).to.equal('');
        });
    });
});
