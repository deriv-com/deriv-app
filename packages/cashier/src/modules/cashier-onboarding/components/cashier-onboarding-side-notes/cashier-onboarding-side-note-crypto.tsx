import React from 'react';
import { Icon, Text } from '@deriv/components';
import { getCurrencyDisplayCode, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { SideNoteCard } from '../../../../components/side-note-card';
import { useCashierStore } from '../../../../stores/useCashierStores';

const CashierOnboardingSideNoteCrypto: React.FC = observer(() => {
    const { client, ui } = useStore();
    const { general_store } = useCashierStore();
    const { currency, loginid } = client;
    const { openRealAccountSignup, is_mobile } = ui;
    const { setDepositTarget } = general_store;
    const currency_code = getCurrencyDisplayCode(currency);

    const onClick = () => {
        setDepositTarget(routes.cashier_deposit);
        openRealAccountSignup('add_crypto');
    };

    return (
        <SideNoteCard
            title={localize('This is your {{currency_code}} account {{loginid}}', { currency_code, loginid })}
            description={localize(
                "Don't want to trade in {{currency_code}}? You can open another cryptocurrency account.",
                {
                    currency_code,
                }
            )}
            hide_paddings={!is_mobile}
        >
            <div
                className='cashier-onboarding-side-notes__link cashier-onboarding-side-notes__link-container'
                onClick={onClick}
            >
                <Text size={is_mobile ? 'xxxs' : 'xxs'} color='red'>
                    {localize('Manage your accounts')}
                </Text>
                <Icon icon='IcChevronRight' color='red' />
            </div>
        </SideNoteCard>
    );
});

export default CashierOnboardingSideNoteCrypto;
