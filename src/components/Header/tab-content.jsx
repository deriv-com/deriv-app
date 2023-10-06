import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import config from '@config';
import { getActiveLoginId, getClientCountry } from '@storage';
import { translate } from '@i18n';
import { setAccountSwitcherId } from '@redux-store/ui-slice';
import { CRYPTO_CURRENCIES } from '@currency-config';

const TabContent = ({ tab = 'real', isActive, setIsAccDropdownOpen, accounts, title = 'Deriv Accounts' }) => {
    const [isAccordionOpen, setIsAccordionOpen] = React.useState(true);
    const dispatch = useDispatch();
    const { login_id } = useSelector(state => state.client);
    const item_ref = React.useRef([]);
    const isReal = tab === 'real';

    const onChangeAccount = id => {
        const active_login_id = getActiveLoginId();
        if (id && active_login_id && id !== active_login_id) {
            dispatch(setAccountSwitcherId(id));
            setIsAccDropdownOpen(false);
        }
    };

    const low_risk_countries = ['za', 'ec', 'bw'];
    const is_country_low_risk = low_risk_countries.includes(getClientCountry());
    const is_active_account_mf = login_id?.includes('MF');

    return (
        <div className={`account__switcher-tabs-content ${isActive ? '' : 'hide'}`}>
            <div className='account__switcher-accordion'>
                {accounts && accounts.length > 0 && (
                    <h3
                        className='ui-accordion-header ui-state-default'
                        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                    >
                        <div className='account__switcher-accordion-header-text'>
                            <span>
                                {is_country_low_risk && isReal ? translate(title) : translate('Deriv Accounts')}
                            </span>
                            <img
                                className={`header__expand ${isAccordionOpen ? 'open' : ''}`}
                                src='/public/images/ic-chevron-down.svg'
                            />
                        </div>
                    </h3>
                )}
                <div className={`account__switcher-list ${isAccordionOpen ? 'open' : ''}`}>
                    {accounts &&
                        accounts.length > 0 &&
                        accounts
                            .sort((acc, acc1) => {
                                const a_currency = acc.currency;
                                const b_currency = acc1.currency;
                                const a_is_crypto = CRYPTO_CURRENCIES.includes(a_currency);
                                const b_is_crypto = CRYPTO_CURRENCIES.includes(b_currency);
                                const a_is_fiat = !a_is_crypto;
                                const b_is_fiat = !b_is_crypto;
                                if (acc.is_virtual || acc1.is_virtual) {
                                    return acc.is_virtual ? 1 : -1;
                                }
                                if ((a_is_crypto && b_is_crypto) || (a_is_fiat && b_is_fiat)) {
                                    return a_currency < b_currency ? -1 : 1;
                                }
                                if (a_is_fiat && b_is_crypto) {
                                    return -1;
                                }
                                return 1;
                            })
                            .map((account, index) => {
                                const { demo_account, currency, balance } = account;
                                const currency_icon = demo_account ? 'virtual' : currency?.toLowerCase() || 'unknown';
                                const getBalance = () =>
                                    balance.toLocaleString(undefined, {
                                        minimumFractionDigits:
                                            config.currency_name_map[currency]?.fractional_digits ?? 2,
                                    });
                                const is_MF = account.account?.includes('MF');

                                return (
                                    isReal !== Boolean(demo_account) && (
                                        <div
                                            className={classNames('account__switcher-acc', {
                                                'account__switcher-acc--active': login_id === account.account,
                                            })}
                                            key={account.account}
                                            onClick={e => {
                                                e.stopPropagation();
                                                onChangeAccount(account.account);
                                            }}
                                            ref={el => (item_ref.current[index] = el)}
                                        >
                                            <input type='hidden' name='account_name' value={account.account} />
                                            <img src={`/public/images/currency/ic-currency-${currency_icon}.svg`} />
                                            <span>
                                                {!currency && !is_active_account_mf && (
                                                    <span className='symbols'>{translate('No currency assigned')}</span>
                                                )}
                                                {
                                                    // eslint-disable-next-line no-nested-ternary
                                                    demo_account
                                                        ? translate('Demo')
                                                        : is_MF && is_active_account_mf
                                                            ? translate('Multiplers')
                                                            : config.currency_name_map[currency]?.name || currency
                                                }
                                                <div className='account__switcher-loginid'>{account.account}</div>
                                            </span>
                                            <span className='account__switcher-balance'>
                                                {currency && getBalance()}
                                                <span className='symbols'>
                                                    &nbsp;
                                                    {currency && currency === 'UST' ? 'USDT' : account?.currency}
                                                </span>
                                            </span>
                                        </div>
                                    )
                                );
                            })}
                </div>
            </div>
        </div>
    );
};

TabContent.propTypes = {
    accounts: PropTypes.array,
    isActive: PropTypes.bool,
    setIsAccDropdownOpen: PropTypes.func,
    tab: PropTypes.string,
    title: PropTypes.string,
};

export default TabContent;
