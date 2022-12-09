import React from 'react';
import { observer } from 'mobx-react-lite';
import { Icon, Button, Text } from '@deriv/components';
import { getPlatformSettings } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { useStore } from '@deriv/stores';
import './account-transfer-no-account.scss';

const AccountTransferNoAccount = () => {
    const {
        client: { is_dxtrade_allowed },
        ui: { toggleAccountsDialog },
    } = useStore();

    return (
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
};

export default observer(AccountTransferNoAccount);
