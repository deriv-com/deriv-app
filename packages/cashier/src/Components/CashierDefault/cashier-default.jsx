import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { isCryptocurrency, routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { ThemedScrollbars, Text } from '@deriv/components';
import { connect } from 'Stores/connect';
import Providers from 'Config/cashier-default-providers';
import CashierDefaultDetail from './cashier-default-detail.jsx';

const CashierDefault = ({
    accounts_list,
    currency,
    is_mobile,
    is_eu,
    is_p2p_enabled,
    is_payment_agent_visible,
    openRealAccountSignup,
    setIsCashierDefault,
    setIsDepositCash,
}) => {
    const history = useHistory();
    const is_crypto = !!currency && isCryptocurrency(currency);
    const has_crypto_account = accounts_list.some(x => x.is_crypto);

    React.useEffect(() => {
        setIsCashierDefault(true);
        return () => setIsCashierDefault(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickDeposit = () => {
        setIsDepositCash(true);
        history.push(routes.cashier_deposit);
    };

    const onClickCrypto = () => {
        if (is_crypto) {
            onClickDeposit();
            return;
        }
        openRealAccountSignup('deposit_cash');
    };

    const onClickPaymentAgent = () => {
        history.push(routes.cashier_pa);
    };

    const onClickDp2p = () => {
        history.push(routes.cashier_p2p);
    };

    const getDepositOptions = () => {
        const options = [];
        if (!is_crypto) {
            options.push(Providers.createCashProvider(onClickDeposit));
        }
        if (!is_eu && (is_crypto || !has_crypto_account)) {
            options.push(Providers.createCryptoProvider(onClickCrypto));
        }
        if (is_payment_agent_visible) {
            options.push(Providers.createPaymentAgentProvider(onClickPaymentAgent));
        }
        if (is_p2p_enabled) {
            options.push(Providers.createDp2pProvider(onClickDp2p));
        }
        return options;
    };

    return (
        <div className='cashier-default'>
            <div className='cashier-default-header'>
                <Text size={is_mobile ? 's' : 'sm'}>
                    <Localize i18n_default_text='Choose a way to fund your account' />
                </Text>
            </div>
            <ThemedScrollbars>
                {getDepositOptions()?.map(deposit => (
                    <CashierDefaultDetail
                        key={deposit.detail_header}
                        detail_click={deposit.detail_click}
                        detail_contents={deposit.detail_contents}
                        detail_description={deposit.detail_description}
                        detail_header={deposit.detail_header}
                        is_mobile={is_mobile}
                    />
                ))}
            </ThemedScrollbars>
        </div>
    );
};

CashierDefault.propTypes = {
    accounts_list: PropTypes.array,
    currency: PropTypes.string,
    is_mobile: PropTypes.bool,
    is_eu: PropTypes.bool,
    is_p2p_enabled: PropTypes.bool,
    is_payment_agent_visible: PropTypes.bool,
    openRealAccountSignup: PropTypes.func,
    setIsCashierDefault: PropTypes.func,
    setIsDepositCash: PropTypes.func,
};

export default connect(({ client, modules, ui }) => ({
    accounts_list: modules.cashier.config.account_transfer.accounts_list,
    currency: client.currency,
    is_eu: client.is_eu,
    is_mobile: ui.is_mobile,
    is_p2p_enabled: modules.cashier.is_p2p_enabled,
    is_payment_agent_visible: modules.cashier.is_payment_agent_visible,
    openRealAccountSignup: ui.openRealAccountSignup,
    setIsCashierDefault: modules.cashier.setIsCashierDefault,
    setIsDepositCash: modules.cashier.setIsDepositCash,
}))(CashierDefault);
