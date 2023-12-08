import { Context } from '../../utils/mocks/mocks';

export default function mockPlatformMt5(context: Context) {
    if ('platform' in context.request && context.request.platform === 'mt5') {
        context.response = {
            echo_req: {
                platform: 'mt5',
                req_id: context.req_id,
                trading_servers: 1,
            },
            msg_type: 'trading_servers',
            req_id: context.req_id,
            trading_servers: [
                {
                    account_type: 'real',
                    disabled: 0,
                    environment: 'Deriv-Server',
                    geolocation: {
                        group: 'asia_synthetic',
                        location: 'Singapore',
                        region: 'Asia',
                        sequence: 1,
                    },
                    id: 'p01_ts03',
                    market_type: 'synthetic',
                    recommended: 1,
                    supported_accounts: ['gaming'],
                },
            ],
        };
    }
}
