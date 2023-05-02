import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../../common/utils/tools';
import { getTokenList } from '../../../../../../common/utils/storageManager';
import { useDispatch } from 'react-redux';
import { setAccountSwitcherToken } from '../../../store/ui-slice';
import classNames from 'classnames';
import config from '../../../../../../app.config';
import { CRYPTO_CURRENCIES } from '../../../../../common/const';

const TabContent = ({ tab = 'real', isActive, setIsAccDropdownOpen, accounts, title = 'Deriv Accounts' }) => {
    const [isAccordionOpen, setIsAccordionOpen] = React.useState(true);
    const dispatch = useDispatch();
    const { active_account_name } = useSelector(state => state.client);
    const item_ref = React.useRef([]);
    const isReal = tab === 'real';
    const token_list = getTokenList();
    const onChangeAccount = acc => {
        const account_token = token_list.find(token => token.accountName === acc);
        if (account_token?.token && acc !== active_account_name) {
            dispatch(setAccountSwitcherToken(account_token?.token));
            setIsAccDropdownOpen(false);
        }
    };
    const low_risk_countries = ['za', 'ec', 'bw'];
    const is_country_low_risk = low_risk_countries.includes(localStorage.getItem('client.country'));
    return (
        <div className={`account__switcher-tabs-content ${isActive ? '' : 'hide'}`}>
            <div className='account__switcher-accordion'>
                {accounts && accounts.length > 0 && (
                    <h3
                        className='ui-accordion-header ui-state-default'
                        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                    >
                        <div className='account__switcher-accordion-header-text'>
                            <span>{is_country_low_risk && isReal ? title : translate('Deriv Accounts')}</span>
                            <img
                                className={`header__expand ${isAccordionOpen ? 'open' : ''}`}
                                src='image/deriv/ic-chevron-down.svg'
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
                                } else if ((a_is_crypto && b_is_crypto) || (a_is_fiat && b_is_fiat)) {
                                    return a_currency < b_currency ? -1 : 1;
                                } else if (a_is_fiat && b_is_crypto) {
                                    return -1;
                                }
                                return 1;
                            })
                            .map((account, index) => {
                                const { demo_account, currency, balance } = account;
                                const currency_icon = demo_account ? 'virtual' : currency?.toLowerCase() || 'unknown';
                                const getBalance = () => {
                                    return balance.toLocaleString(undefined, {
                                        minimumFractionDigits:
                                            config.currency_name_map[currency]?.fractional_digits ?? 2,
                                    });
                                };
                                return (
                                    isReal !== Boolean(demo_account) && (
                                        <div
                                            className={classNames('account__switcher-acc', {
                                                'account__switcher-acc--active':
                                                    active_account_name === account.account,
                                            })}
                                            key={account.account}
                                            onClick={e => {
                                                e.stopPropagation();
                                                onChangeAccount(account.account);
                                            }}
                                            ref={el => (item_ref.current[index] = el)}
                                        >
                                            <input type='hidden' name='account_name' value={account.account} />
                                            <img src={`image/deriv/currency/ic-currency-${currency_icon}.svg`} />
                                            <span>
                                                {!currency && !active_account_name?.includes('MF') && (
                                                    <span className='symbols'>{translate('No currency assigned')}</span>
                                                )}
                                                {demo_account
                                                    ? translate('Demo')
                                                    : account.account?.includes('MF') &&
                                                        (active_account_name?.includes('MF'))
                                                        ? 'Multiplers'
                                                        : config.currency_name_map[currency]?.name || currency}

                                                <div className='account__switcher-loginid'>{account.account}</div>
                                            </span>
                                            <span className='account__switcher-balance'>
                                                {account?.currency && getBalance()}
                                                <span className='symbols'>
                                                    &nbsp;
                                                    {account?.currency === 'UST' ? 'USDT' : account?.currency}
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

export default TabContent;
