import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Icon, Text } from '@deriv/components';
import { routes, getCurrencyDisplayCode } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { RootStore } from 'Types';

type TNoBalanceProps = RouteComponentProps & {
    currency: string;
    is_deposit_locked: boolean;
    setTabIndex: (tab_index: number) => void;
};

const NoBalance = ({ currency, history, is_deposit_locked, setTabIndex }: TNoBalanceProps) => {
    const onClickDeposit = () => {
        // index of deposit tab in the cashier modal is 0
        setTabIndex(0);
        history.push(routes.cashier_deposit);
    };

    return (
        <div className='cashier__wrapper cashier__no-balance'>
            <Icon icon='IcCashierNoBalance' className='cashier__no-balance-icon' size={116} />
            <Text as='h2' weight='bold' align='center'>
                <Localize
                    i18n_default_text='You have no funds in your {{currency}} account'
                    values={{ currency: getCurrencyDisplayCode(currency) }}
                />
            </Text>
            {!is_deposit_locked && (
                <>
                    <Text as='p' size='xs' line_height='s' align='center' className='cashier__text'>
                        <Localize i18n_default_text='Please make a deposit to use this feature.' />
                    </Text>
                    <Button
                        className='cashier__no-balance-button'
                        has_effect
                        text={localize('Deposit now')}
                        onClick={onClickDeposit}
                        primary
                        large
                    />
                </>
            )}
        </div>
    );
};

export default withRouter(
    connect(({ client, modules }: RootStore) => ({
        currency: client.currency,
        is_deposit_locked: modules.cashier.deposit.is_deposit_locked,
        setTabIndex: modules.cashier.general_store.setCashierTabIndex,
    }))(NoBalance)
);
