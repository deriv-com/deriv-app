import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../../common/utils/tools';
import { getTokenList } from '../../../../../../common/utils/storageManager';
import { useDispatch } from 'react-redux';
import { setAccountSwitcherToken } from '../../../store/ui-slice';
import classNames from 'classnames';
import { observer as globalObserver } from '../../../../../../common/utils/observer';
import config from '../../../../../../app.config';

const TabContent = ({ tab, isActive, setIsAccDropdownOpen }) => {
    const [isAccordionOpen, setIsAccordionOpen] = React.useState(true);
    const dispatch = useDispatch();
    const { accounts, active_account_name, account_type } = useSelector(state => state.client);
    const { show_bot_unavailable_page } = useSelector(state => state.ui);
    const item_ref = React.useRef([]);
    const isReal = tab === 'real';
    const token_list = getTokenList();
    const { visible, url, label } = config.add_account;
    const { is_multiplier } = account_type;
    const onChangeAccount = acc => {
        const account_token = token_list.find(token => token.accountName === acc);
        if (account_token?.token && acc !== active_account_name) {
            if (show_bot_unavailable_page) {
                globalObserver.emit('ui.switch_account', account_token.token);
            } else {
                dispatch(setAccountSwitcherToken(account_token?.token));
            }
            setIsAccDropdownOpen(false);
        }
    };

    return (
        <div className={`account__switcher-tabs-content ${isActive ? '' : 'hide'}`}>
            <div className='account__switcher-accordion'>
                <h3
                    className='ui-accordion-header ui-state-default'
                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                >
                    <div className='account__switcher-accordion-header-text'>
                        <span>{translate(isReal ? 'Deriv accounts' : 'Demo accounts')}</span>
                        <img
                            className={`header__expand ${isAccordionOpen ? 'open' : ''}`}
                            src='image/deriv/ic-chevron-down.svg'
                        />
                    </div>
                </h3>
                <div className={`account__switcher-list ${isAccordionOpen ? 'open' : ''}`}>
                    {accounts &&
                        Object.keys(accounts)
                            .sort((acc, acc1) => {
                                return acc === active_account_name ? -1 : acc1 === active_account_name ? 1 : 0;
                            })
                            .map((acc, index) => {
                                const account = accounts[acc];
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
                                                'account__switcher-acc--active': index === 0,
                                            })}
                                            key={acc}
                                            onClick={e => {
                                                e.stopPropagation();
                                                onChangeAccount(acc);
                                            }}
                                            ref={el => (item_ref.current[index] = el)}
                                        >
                                            <input type='hidden' name='account_name' value={acc} />
                                            <img src={`image/deriv/currency/ic-currency-${currency_icon}.svg`} />
                                            <span>
                                                {!currency && (
                                                    <span className='symbols'>{translate('No currency assigned')}</span>
                                                )}
                                                {demo_account
                                                    ? translate('Demo')
                                                    : is_multiplier
                                                    ? 'Multiplers'
                                                    : config.currency_name_map[currency]?.name || currency}

                                                <div className='account__switcher-loginid'>{acc}</div>
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
