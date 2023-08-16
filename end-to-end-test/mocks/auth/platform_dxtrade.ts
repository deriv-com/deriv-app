export default function mock_platform_dxtrade(context) {
    if (context.request.platform === 'dxtrade' && context.request.trading_servers === 1) {
        context.response = {
            echo_req: {
                platform: 'dxtrade',
                req_id: context.req_id,
                trading_servers: 1,
            },
            msg_type: 'trading_servers',
            req_id: context.req_id,
            trading_servers: [
                {
                    account_type: 'real',
                    disabled: 0,
                    supported_accounts: ['all'],
                },
                {
                    account_type: 'demo',
                    disabled: 0,
                    supported_accounts: ['all'],
                },
            ],
        };
    }
}
