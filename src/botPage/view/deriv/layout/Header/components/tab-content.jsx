import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../../common/utils/tools';
import { getTokenList } from '../../../../../../common/utils/storageManager';
import { useDispatch } from 'react-redux';
import { setAccountSwitcherToken } from '../../../store/ui-slice';
import classNames from 'classnames';
import config from '../../../../../../app.config';

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
                                return acc === active_account_name ? -1 : acc1 === active_account_name ? 1 : 0;
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
                                                {!currency && (
                                                    <span className='symbols'>{translate('No currency assigned')}</span>
                                                )}
                                                {demo_account
                                                    ? translate('Demo')
                                                    : account.account?.includes('MF') &&
                                                      active_account_name?.includes('MF')
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
