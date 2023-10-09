import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { api_base } from '@api-base';
import config from '@config';
import { isMobile, isDesktop } from '@utils';
import { removeAllTokens, getActiveLoginId, getClientAccounts } from '@storage';
import * as client_slice from '@redux-store/client-slice';
import { setAccountSwitcherLoader, updateShowMessagePage } from '@redux-store/ui-slice';
import { observer as globalObserver } from '@utilities/observer';
import PlatformDropdown from './platform-dropdown';
import DrawerMenu from './drawer-menu';
import AuthButtons from './auth-buttons';
import AccountActions from './account-actions';
import MenuLinks from './menu-links';
import Loader from './loader';
import { checkSwitcherType, isEuByAccount } from '../../common/footer-checks';
import './header.scss';

const AccountSwitcher = () => {
    const { account_switcher_loader } = useSelector(state => state.ui);
    const { is_logged } = useSelector(state => state.client);

    if (account_switcher_loader) {
        return (
            <div className='header__menu-right-loader'>
                <Loader />
            </div>
        );
    }
    if (is_logged) return <AccountActions />;
    return <AuthButtons />;
};

const Header = () => {
    const [isPlatformSwitcherOpen, setIsPlatformSwitcherOpen] = React.useState(false);
    const [showDrawerMenu, updateShowDrawerMenu] = React.useState(false);
    const platformDropdownRef = React.useRef();
    const { is_logged, login_id } = useSelector(state => state.client);
    const { is_bot_running } = useSelector(state => state.ui);
    const dispatch = useDispatch();
    const hideDropdown = e => !platformDropdownRef?.current?.contains(e.target) && setIsPlatformSwitcherOpen(false);

    // Login check or account check should not happen here
    // it should happen in the main component which main.jsx
    // We need to move every check related to login or active account to main.jsx
    React.useEffect(() => {
        const active_account = { ...api_base.account_info };
        const { landing_company_name } = active_account;
        if (landing_company_name === 'maltainvest') {
            dispatch(updateShowMessagePage(true));
        }

        globalObserver.setState({
            is_eu_country: isEuByAccount(active_account),
        });

        if (!active_account) {
            removeAllTokens();
            dispatch(client_slice.resetClient());
            dispatch(setAccountSwitcherLoader(false));
        }

        const client_accounts = getClientAccounts();
        const current_login_id = getActiveLoginId();
        const logged_in_token = client_accounts[current_login_id]?.token || active_account?.token || '';

        if (logged_in_token) {
            dispatch(setAccountSwitcherLoader(false));
        }
    }, [login_id]);

    React.useEffect(() => {
        api_base.api.expectResponse('balance').then(({ balance }) => {
            dispatch(client_slice.updateBalance(balance));
            globalObserver.setState({
                balance: Number(balance.balance),
                currency: balance.currency,
            });
        });

        api_base.api.onMessage().subscribe(({ data }) => {
            if (data.msg_type === 'balance') {
                dispatch(client_slice.updateBalance(data.balance));
                globalObserver.setState({
                    balance: Number(data.balance.balance),
                    currency: data.balance.currency,
                });
            }
        });

        const mountSwitcher = () => {
            const res = checkSwitcherType();
            if (res) {
                dispatch(client_slice.updateAccountType(res));
                const current_login_id = getActiveLoginId();
                if (current_login_id?.startsWith('MF')) {
                    dispatch(updateShowMessagePage(true));
                }
            }
        };
        mountSwitcher();
    }, []);

    React.useEffect(() => {
        window.addEventListener('beforeunload', onBeforeUnload, { capture: true });
        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload, { capture: true });
        };
    }, [is_bot_running]);

    const onBeforeUnload = e => {
        if (is_bot_running) {
            e.preventDefault();
            e.returnValue = true;
        }
    };

    return (
        <div className='header'>
            <div id='deriv__header' className='header__menu-items'>
                {isDesktop() && (
                    <div className='header__menu-left'>
                        {isPlatformSwitcherOpen && (
                            <PlatformDropdown
                                hideDropdown={hideDropdown}
                                ref={platformDropdownRef}
                                setIsPlatformSwitcherOpen={setIsPlatformSwitcherOpen}
                            />
                        )}
                        <div
                            id='platform__switcher'
                            className='header__menu-item platform__switcher'
                            onClick={() => setIsPlatformSwitcherOpen(!isPlatformSwitcherOpen)}
                        >
                            <img className='header__logo' src={config.app_logo} />
                            <img
                                id='platform__switcher-expand'
                                className={classNames('header__icon header__expand', {
                                    open: isPlatformSwitcherOpen,
                                })}
                                src='/public/images/ic-chevron-down-bold.svg'
                            />
                        </div>
                        {is_logged && <MenuLinks />}
                    </div>
                )}
                {isMobile() && (
                    <img
                        className='btn__close header__hamburger'
                        src='/public/images/ic-hamburger.svg'
                        onClick={() => {
                            updateShowDrawerMenu(true);
                        }}
                    />
                )}
                <div className='header__menu-right'>
                    <AccountSwitcher />
                </div>
            </div>
            {showDrawerMenu && (
                <DrawerMenu
                    updateShowDrawerMenu={updateShowDrawerMenu}
                    setIsPlatformSwitcherOpen={setIsPlatformSwitcherOpen}
                    isPlatformSwitcherOpen={isPlatformSwitcherOpen}
                    hideDropdown={hideDropdown}
                    platformDropdownRef={platformDropdownRef}
                    is_logged={is_logged}
                />
            )}
        </div>
    );
};

export default Header;
