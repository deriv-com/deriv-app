import React, { useEffect } from 'react';
import { Icon, Text, Button } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { useRequest } from '@deriv/api';
import { useStore } from '@deriv/stores';
import './demo-reset-balance.scss';

const DemoResetBalance = () => {
    const [is_transferred_success, setIsTransferredSuccess] = React.useState(false);
    const { data, mutate } = useRequest('topup_virtual');
    const { client } = useStore();
    const { active_accounts } = client;
    const balance = active_accounts.find(acc => acc.is_virtual === 0)?.balance;

    useEffect(() => {
        // TODO: check the if condition
        if (data) setIsTransferredSuccess(true);
    }, [data]);

    const resetBalance = () => {
        mutate([]);
    };

    const redirectToTransferTab = () => {
        // eslint-disable-next-line no-console
        console.log('redirect to transfer tab');
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
            >
                <Localize i18n_default_text='Reset your virtual balance if it falls below 10,000.00 USD or exceeds 10,000.00 USD.' />
            </Text>

            {is_transferred_success ? (
                <Button className='reset-balance__button' secondary large onClick={() => redirectToTransferTab()}>
                    <Localize i18n_default_text='Reset balance' />
                </Button>
            ) : (
                <Button
                    className='reset-balance__button'
                    large={!isMobile()}
                    medium={isMobile()}
                    primary
                    disabled={balance === 10000}
                    onClick={() => resetBalance()}
                >
                    <Localize i18n_default_text='Reset balance' />
                </Button>
            )}
        </div>
    );
};

export default DemoResetBalance;
