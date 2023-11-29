import React from 'react';
import { Icon, Text, Button, Div100vhContainer } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useRequest } from '@deriv/api';
import { observer, useStore } from '@deriv/stores';
import './demo-reset-balance.scss';

type TDemoResetBalanceProps = {
    setActiveTabIndex?: (index: number) => void;
};

const DemoResetBalance = observer(({ setActiveTabIndex }: TDemoResetBalanceProps) => {
    const { mutate, isSuccess: isResetBalanceSuccess } = useRequest('topup_virtual');
    const { client, ui } = useStore();
    const { accounts, loginid } = client;
    const { is_mobile } = ui;

    const can_reset_balance = loginid && (accounts[loginid]?.balance || 0) !== 10000;

    const resetBalance = () => {
        mutate();
    };

    const redirectToTransferTab = () => {
        setActiveTabIndex?.(0);
    };

    return (
        <Div100vhContainer height_offset='244px'>
            <div className='reset-balance'>
                <Icon icon={isResetBalanceSuccess ? 'IcDemoResetBalanceDone' : 'IcDemoResetBalance'} size='128' />

                <Text
                    as='p'
                    className='reset-balance__title'
                    size={is_mobile ? 's' : 'sm'}
                    line_height={is_mobile ? 'xl' : 'xxl'}
                    weight='bold'
                >
                    {isResetBalanceSuccess ? (
                        <Localize i18n_default_text='Success' />
                    ) : (
                        <Localize i18n_default_text='Reset balance to 10,000.00 USD' />
                    )}
                </Text>

                <Text
                    as='p'
                    className='reset-balance__text'
                    size={is_mobile ? 'xxs' : 'xs'}
                    line_height={is_mobile ? 'l' : 'xl'}
                    align='center'
                >
                    {isResetBalanceSuccess ? (
                        <Localize i18n_default_text='Your balance has been reset to 10,000.00 USD.' />
                    ) : (
                        <Localize i18n_default_text='Reset your virtual balance if it falls below 10,000.00 USD or exceeds 10,000.00 USD.' />
                    )}
                </Text>

                {isResetBalanceSuccess ? (
                    <Button className='reset-balance__button' large secondary onClick={() => redirectToTransferTab()}>
                        <Localize i18n_default_text='Transfer funds' />
                    </Button>
                ) : (
                    <Button
                        className='reset-balance__button'
                        disabled={!can_reset_balance}
                        large={!is_mobile}
                        medium={is_mobile}
                        primary
                        onClick={resetBalance}
                    >
                        <Localize i18n_default_text='Reset balance' />
                    </Button>
                )}
            </div>
        </Div100vhContainer>
    );
});

export default DemoResetBalance;
