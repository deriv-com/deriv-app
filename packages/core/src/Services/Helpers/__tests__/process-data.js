import { getOauthAppsObject } from '../process-data.js';

describe('getOauthAppsObject', () => {
    const oauth_response = {
        echo_req: {
            oauth_apps: 1,
        },
        msg_type: 'oauth_apps',
        oauth_apps: [
            {
                app_id: '1',
                app_markup_percentage: '0',
                last_used: {},
                name: 'Binary.com',
                scopes: ['read', 'admin', 'trade', 'payments'],
            },
        ],
    };

    it('Expects default oauth object when there are no arguments', () => {
        expect(getOauthAppsObject()).toEqual({ 2: 'Binary.com Autoexpiry' });
    });

    it('Expects correct value when arguments passed', () => {
        expect(getOauthAppsObject(oauth_response)).toEqual({
            1: 'Binary.com',
            2: 'Binary.com Autoexpiry',
        });
    });
});
