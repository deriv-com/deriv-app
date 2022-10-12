import React from 'react';
import { Icon, Button, Text } from '@deriv/components';
import { getPlatformSettings } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { TRootStore, TClientStore, TUiStore } from 'Types';
import './account-transfer-no-account.scss';

type TAccountTransferNoAccountProps = {
    is_dxtrade_allowed: TClientStore['is_dxtrade_allowed'];
    toggleAccountsDialog: TUiStore['toggleAccountsDialog'];
};

const AccountTransferNoAccount = ({ is_dxtrade_allowed, toggleAccountsDialog }: TAccountTransferNoAccountProps) => (
    <div className='cashier__wrapper cashier__no-balance'>
        <Icon icon='IcCashierNoBalance' className='cashier__no-balance-icon' size={116} />
        <Text as='h2' weight='bold' align='center'>
            <Localize i18n_default_text='You need at least two accounts' />
        </Text>
        <Text as='p' size='xs' line_height='s' align='center' className='cashier__text'>
            {is_dxtrade_allowed ? (
                <Localize
                    i18n_default_text='Please create another Deriv, {{platform_name_mt5}}, or {{platform_name_dxtrade}} account.'
                    values={{
                        platform_name_mt5: getPlatformSettings('mt5').name,
                        platform_name_dxtrade: getPlatformSettings('dxtrade').name,
                    }}
                />
            ) : (
                <Localize
                    i18n_default_text='Please create another Deriv or {{platform_name_mt5}} account.'
                    values={{ platform_name_mt5: getPlatformSettings('mt5').name }}
                />
            )}
        </Text>
        <Button className='account-transfer-no-account__button' primary large onClick={toggleAccountsDialog}>
            <Localize i18n_default_text='Create account' />
        </Button>
    </div>
);

export default connect(({ ui, client }: TRootStore) => ({
    is_dxtrade_allowed: client.is_dxtrade_allowed,
    toggleAccountsDialog: ui.toggleAccountsDialog,
}))(AccountTransferNoAccount);
