import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Icon, Text } from '@deriv/components';
import { useDepositLocked } from '@deriv/hooks';
import { routes, getCurrencyDisplayCode } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import { useCashierStore } from '../../stores/useCashierStores';

type TNoBalanceProps = RouteComponentProps & {
    onClickDeposit?: () => void;
};

const NoBalance = observer(({ history, onClickDeposit }: TNoBalanceProps) => {
    const { client } = useStore();
    const { currency } = client;
    const { general_store } = useCashierStore();
    const { setCashierTabIndex: setTabIndex } = general_store;
    const is_deposit_locked = useDepositLocked();

    const onClickDepositHandler = () => {
        if (onClickDeposit) {
            onClickDeposit();
        } else {
            // index of deposit tab in the cashier modal is 0
            setTabIndex(0);
            history.push(routes.cashier_deposit);
        }
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
                        style={{ marginTop: '2rem' }}
                        className='cashier__no-balance-button'
                        has_effect
                        text={localize('Deposit now')}
                        onClick={onClickDepositHandler}
                        primary
                        large
                    />
                </>
            )}
        </div>
    );
});

export default withRouter(NoBalance);
