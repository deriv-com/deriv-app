/* eslint-disable sort-keys */

import { Context } from '@deriv/integration/src/utils/mocks/mocks';

export function mockCryptoConfig(context: Context) {
    if ('crypto_config' in context.request) {
        context.response = {
            crypto_config: {
                currencies_config: {
                    BTC: {
                        minimum_withdrawal: 0.00027139,
                    },
                    ETH: {
                        minimum_withdrawal: 0.02610469,
                    },
                    LTC: {
                        minimum_withdrawal: 0.06689858,
                    },
                    USDC: {
                        minimum_withdrawal: 50,
                    },
                    UST: {
                        minimum_withdrawal: 24.98,
                    },
                    eUSDT: {
                        minimum_withdrawal: 49.96,
                    },
                    tUSDT: {
                        minimum_deposit: 50,
                        minimum_withdrawal: 24.98,
                    },
                },
            },
            echo_req: context.request,
            msg_type: 'crypto_config',
            req_id: context.req_id,
        };
    }
}
