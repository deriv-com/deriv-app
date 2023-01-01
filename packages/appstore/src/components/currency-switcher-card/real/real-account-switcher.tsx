import React from 'react';
import { observer } from 'mobx-react-lite';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import CurrencySwitcherLoader from 'Components/pre-loader/currency-switcher-loader';
import { useStores } from 'Stores/index';
import StatusBadge from './switcher-status-badge';
import RealAccountCard from './real-account-card';
import './real-account-switcher.scss';

const AccountNeedsVerification = () => {
    return (
        <CurrencySwitcherContainer
            className='real-account-switcher__container'
            title={
                <Text size='xs' line_height='s'>
                    {localize('Needs Verification')}
                </Text>
            }
            icon='VIRTUAL'
        >
            <StatusBadge />
        </CurrencySwitcherContainer>
    );
};

const RealAccountSwitcher = () => {
    const { client } = useStores();
    const { is_authentication_needed, is_switching, has_any_real_account } = client;

    if (is_switching) {
        return (
            <div className='real-account-switcher__container loader'>
                <CurrencySwitcherLoader />
            </div>
        );
    }

    if (is_authentication_needed) {
        return <AccountNeedsVerification />;
    }

    if (has_any_real_account) {
        return <RealAccountCard />;
    }

    return null;
};

export default observer(RealAccountSwitcher);
