import React from 'react';
import { useRequest } from '@deriv/api';
import { Icon, Text } from '@deriv/components';
import { useHistory } from 'react-router-dom';

const WalletResetBalance = () => {
    const history = useHistory();
    const { isSuccess: isResetBalanceSuccess, mutate } = useRequest('topup_virtual');

    const is_mobile = false;
    const can_reset_balance = Math.random() > 0.5;

    const resetBalance = () => {
        mutate();
    };

    return (
        <div className='wallets-transactions-no-data-state'>
            <Icon icon={isResetBalanceSuccess ? 'IcDemoResetBalanceDone' : 'IcDemoResetBalance'} size='128' />
            <p>Reset balance to 10,000.00 USD</p>
            <Text
                as='p'
                className='reset-balance__title'
                line_height={is_mobile ? 'xl' : 'xxl'}
                size={is_mobile ? 's' : 'sm'}
                weight='bold'
            >
                {isResetBalanceSuccess ? (
                    <>Your balance has been reset to 10,000.00 USD.</>
                ) : (
                    <>Reset your virtual balance if it falls below 10,000.00 USD or exceeds 10,000.00 USD.</>
                )}
            </Text>

            <div className='wallets-transactions-no-data-state__buttons'>
                <button
                    className='wallets-transactions-no-data-state__buttons__deposit'
                    disabled={!can_reset_balance}
                    onClick={resetBalance}
                >
                    Reset balance
                </button>

                <button
                    className='wallets-transactions-no-data-state__buttons__transfer'
                    onClick={() => history.push('/wallets/cashier/transfer')}
                >
                    Transfer funds
                </button>
            </div>
        </div>
    );
};

export default WalletResetBalance;
