import React from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import config from '../../../../../../app.config';
import useLogout from '../../../../../../common/hooks/useLogout.js';
import { observer as globalObserver } from '../../../../../../common/utils/observer';
import { translate } from '../../../../../../common/utils/tools';
import Modal from '../../../components/modal';
import { setShouldReloadWorkspace } from '../../../store/ui-slice.js';
import AccountSwitchModal from './account-switch-modal.jsx';
import TabContent from './tab-content.jsx';
import RiskComponent from './risk-component.jsx';

const Separator = () => <div className='account__switcher-seperator'></div>;
const getTotalDemo = accounts => {
    if (!accounts) return 0;
    const demo_account = Object.values(accounts).find(acc => acc.demo_account && acc.type === 'deriv');
    const total = demo_account?.balance || 0;
    return total.toLocaleString(undefined, {
        minimumFractionDigits: config.currency_name_map[total]?.fractional_digits ?? 2,
    });
};

const AccountDropdown = React.forwardRef((props, dropdownRef) => {
    const { setIsAccDropdownOpen, virtual } = props;
    const [activeTab, setActiveTab] = React.useState(virtual ? 'demo' : 'real');
    const [show_logout_modal, updaetShowLogoutModal] = React.useState(false);
    const { accounts, balance, currency, account_type } = useSelector(state => state.client);
    const { is_bot_running, show_bot_unavailable_page } = useSelector(state => state.ui);
    const { url } = config.add_account;
    const container_ref = React.useRef();
    const dispatch = useDispatch();
    const location = useLocation();
    const logout = useLogout();
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (container_ref.current && !container_ref?.current?.contains(event.target)) {
                setIsAccDropdownOpen(false);
            }
        }
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const { low_risk_without_account, high_risk_without_account } = account_type;

    const obj = account_type;
    const keys = Object.keys(obj).filter(get_key => {
        return obj[get_key] === true;
    });

    const getComponent = type => {
        return <RiskComponent type={type} />;
    };

    const onLogout = () => {
        if (location.pathname.includes('endpoint')) {
            logout();
        } else {
            globalObserver.emit('ui.logout');
        }
        dispatch(setShouldReloadWorkspace(true));
    };

    return (
        <div className='account__switcher-dropdown-wrapper show' ref={dropdownRef}>
            <div id='account__switcher-dropdown' className='account__switcher-dropdown' ref={container_ref}>
                <div className='account__switcher-container'>
                    <ul className='account__switcher-tabs'>
                        <li
                            className={`account__switcher-tab ${activeTab === 'real' ? 'ui-tabs-active' : ''}`}
                            onClick={() => setActiveTab('real')}
                        >
                            <a>{translate('Real')}</a>
                        </li>
                        <li
                            className={`account__switcher-tab ${activeTab === 'real' ? '' : 'ui-tabs-active'}`}
                            onClick={() => setActiveTab('demo')}
                        >
                            <a>{translate('Demo')}</a>
                        </li>
                    </ul>
                    {(keys[0] === 'low_risk_without_account' ||
                        keys[0] === 'high_risk_without_account' ||
                        keys[0] === 'high_risk_or_eu') &&
                    activeTab === 'real' ? (
                        <>{getComponent(keys[0])}</>
                    ) : (
                        <TabContent
                            tab='real'
                            isActive={activeTab === 'real'}
                            setIsAccDropdownOpen={setIsAccDropdownOpen}
                            accounts={accounts}
                        />
                    )}
                    <TabContent
                        tab='demo'
                        isActive={activeTab === 'demo'}
                        setIsAccDropdownOpen={setIsAccDropdownOpen}
                        accounts={accounts}
                    />
                </div>
                <Separator />
                <div className='account__switcher-total'>
                    <div className='account__switcher-total-balance'>
                        <span className='account__switcher-total-balance-text'>{translate('Total assets')}</span>
                        <span className='account__switcher-total-balance-amount account__switcher-balance'>
                            {activeTab === 'demo'
                                ? getTotalDemo(accounts)
                                : low_risk_without_account || high_risk_without_account
                                ? 0
                                : balance.toLocaleString(undefined, {
                                      minimumFractionDigits: config.currency_name_map[currency]?.fractional_digits ?? 2,
                                  })}
                            <span className='symbols'>&nbsp;{activeTab === 'demo' ? 'USD' : currency}</span>
                        </span>
                    </div>
                    <Separator />
                    {/* only if we have real account */}
                    <a href={config.tradershub.url} className={'account__switcher-total--link'}>
                        <span>Looking for CFD accounts? Go to Trader's hub</span>
                    </a>
                    <Separator />
                    <div
                        className={classNames('account__switcher-footer', {
                            'account__switcher-footer--demo': activeTab === 'demo',
                        })}
                    >
                        {activeTab === 'real' && (
                            <a href={url} rel='noopener noreferrer'>
                                <div>
                                    <button className='account__switcher-footer__manage'>Manage Accounts</button>
                                </div>
                            </a>
                        )}
                        <div
                            id='deriv__logout-btn'
                            className='account__switcher-logout logout'
                            onClick={() => {
                                if (show_bot_unavailable_page) onLogout();
                                else updaetShowLogoutModal(true);
                            }}
                        >
                            <span className='account__switcher-logout-text'>{translate('Log out')}</span>
                            <img
                                className='account__switcher-logout-icon logout-icon'
                                src='image/deriv/ic-logout.svg'
                            />
                        </div>
                    </div>
                </div>
            </div>
            {show_logout_modal && (
                <Modal
                    title={translate('Are you sure?')}
                    class_name='logout'
                    onClose={() => updaetShowLogoutModal(false)}
                >
                    <AccountSwitchModal
                        is_bot_running={is_bot_running}
                        onClose={() => updaetShowLogoutModal(false)}
                        onAccept={onLogout}
                    />
                </Modal>
            )}
        </div>
    );
});

export default AccountDropdown;
