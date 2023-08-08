import React from 'react';
import { Button, Text } from '@deriv/components';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import BalanceText from 'Components/elements/text/balance-text';
import './demo-account-card.scss';
import { localize } from '@deriv/translations';
import { usePlatformAccounts, useWalletMigration } from '@deriv/hooks';
import { useStore, observer } from '@deriv/stores';

const DemoAccountCard = observer(() => {
    const { client, traders_hub, common } = useStore();
    const { accounts, loginid, resetVirtualBalance, default_currency, setWalletsMigrationInProgressPopup } = client;
    const { selected_account_type } = traders_hub;
    const { demo: platform_demo_account } = usePlatformAccounts();
    const { is_in_progress } = useWalletMigration();

    const canResetBalance = () => {
        return loginid && (accounts[loginid]?.balance || 0) !== 10000;
    };

    const { current_language } = common;

    return (
        <CurrencySwitcherContainer
            className='demo-account-card'
            icon='VIRTUAL'
            title={
                <Text className='demo-account-card__title' size='xs' line_height='s'>
                    {localize(selected_account_type)}
                </Text>
            }
            actions={
                canResetBalance() && (
                    <Button
                        key={`currency-switcher__button--key-${current_language}`}
                        secondary
                        onClick={is_in_progress ? () => setWalletsMigrationInProgressPopup(true) : resetVirtualBalance}
                        className='currency-switcher__button'
                        as_disabled={is_in_progress}
                    >
                        {localize('Reset Balance')}
                    </Button>
                )
            }
        >
            <BalanceText
                currency={platform_demo_account?.currency || default_currency}
                balance={platform_demo_account?.balance || 0}
                size='xs'
            />
        </CurrencySwitcherContainer>
    );
});

export default DemoAccountCard;
