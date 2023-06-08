import React, { useEffect } from 'react';
import { Icon, Text, Button } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { useRequest } from '@deriv/api';
import { useStore } from '@deriv/stores';
import './demo-reset-balance.scss';

type TDemoResetBalanceProps = {
    setActiveTabIndex: (index: number) => void;
};

const DemoResetBalance = ({ setActiveTabIndex }: TDemoResetBalanceProps) => {
    const [is_transferred_success, setIsTransferredSuccess] = React.useState(false);
    const { mutate, isSuccess } = useRequest('topup_virtual');
    const { client } = useStore();
    const { active_accounts } = client;
    const balance = active_accounts.find(acc => acc.is_virtual === 1)?.balance;

    useEffect(() => {
        if (isSuccess) setIsTransferredSuccess(true);
    }, [isSuccess, setActiveTabIndex]);

    const resetBalance = () => {
        mutate([]);
    };

    const redirectToTransferTab = () => {
        setActiveTabIndex(0);
    };

    return (
        <div className='reset-balance'>
            <Icon icon='IcDemoResetBalance' size='128' />

            <Text
                as='p'
                className='reset-balance__title'
                size={isMobile() ? 's' : 'sm'}
                line_height={isMobile() ? 'xl' : 'xxl'}
                weight='bold'
            >
                <Localize i18n_default_text='Reset balance to 10,000.00 USD' />
            </Text>

            <Text
                as='p'
                className='reset-balance__text'
                size={isMobile() ? 'xxs' : 'xs'}
                line_height={isMobile() ? 'l' : 'xl'}
                align='center'
            >
                {is_transferred_success ? (
                    <Localize i18n_default_text='Your balance has been reset to 10,000.00 USD.' />
                ) : (
                    <Localize i18n_default_text='Reset your virtual balance if it falls below 10,000.00 USD or exceeds 10,000.00 USD.' />
                )}
            </Text>

            {is_transferred_success ? (
                <Button
                    className='reset-balance__button'
                    data-testid='dt_transfer_fund_button'
                    large
                    secondary
                    onClick={() => redirectToTransferTab()}
                >
                    <Localize i18n_default_text='Transfer funds' />
                </Button>
            ) : (
                <Button
                    className='reset-balance__button'
                    data-testid='dt_reset_balance_button'
                    disabled={balance === 10000}
                    large={!isMobile()}
                    medium={isMobile()}
                    primary
                    onClick={() => resetBalance()}
                >
                    <Localize i18n_default_text='Reset balance' />
                </Button>
            )}
        </div>
    );
};

export default DemoResetBalance;
