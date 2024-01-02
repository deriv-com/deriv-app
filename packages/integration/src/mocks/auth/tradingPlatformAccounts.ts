import { Context } from '../../utils/mocks/mocks';

export default function mockTradingPlatformAccounts(context: Context) {
    if ('trading_platform_accounts' in context.request && context.request.trading_platform_accounts === 1) {
        context.response = {
            echo_req: {
                platform: 'derivez',
                req_id: context.req_id,
                trading_platform_accounts: 1,
            },
            msg_type: 'transfer_between_accounts',
            req_id: context.req_id,
            trading_platform_accounts: [],
        };
    }
}
