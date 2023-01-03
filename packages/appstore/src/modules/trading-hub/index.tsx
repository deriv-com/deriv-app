import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { platform_config, mf_platform_config } from 'Constants/platform-config';
import Joyride from 'react-joyride';
import { useHistory } from 'react-router-dom';
import { Text, Button, ButtonToggle, Dropdown, DesktopWrapper, MobileWrapper, Loading } from '@deriv/components';
import { routes, isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import ToggleAccountType from 'Components/toggle-account-type';
import {
    tour_step_config,
    tour_styles,
    tour_step_locale,
    eu_tour_step_locale,
    tour_styles_dark_mode,
} from 'Constants/tour-steps-config';
import { useStores } from 'Stores';
import { ResetTradingPasswordModal } from '@deriv/account';
import {
    JurisdictionModal,
    CFDPasswordModal,
    CFDDbviOnBoarding,
    CFDPersonalDetailsModal,
    CFDResetPasswordModal,
    CFDTopUpDemoModal,
    MT5TradeModal,
    CFDPasswordManagerModal,
} from '@deriv/cfd';
import CFDServerErrorDialog from '@deriv/cfd/src/Containers/cfd-server-error-dialog';
import CFDAccounts from 'Components/CFDs';
import OptionsAccounts from 'Components/options';
import TotalAssets from 'Components/total-assets';
import Divider from 'Components/elements/divider';
import { TAccountCategory } from 'Types';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import './trading-hub.scss';

const TradingHub: React.FC = () => {
    const store = useStores();
    const { ui, modules, common, client, tradinghub } = useStores();
    const {
        is_logged_in,
        is_eu,
        is_eu_country,
        is_populating_mt5_account_list,
        is_populating_dxtrade_account_list,
        switchAccountHandlerForAppstore,
    } = client;
    const {
        setAccountType,
        enableCFDPasswordModal,
        current_list,
        is_mt5_trade_modal_visible,
        toggleMT5TradeModal,
        getRealSyntheticAccountsExistingData,
        getRealFinancialAccountsExistingData,
    } = modules.cfd;
    const { platform } = common;
    const { is_dark_mode_on } = ui;
    const { is_tour_open, toggleIsTourOpen, is_onboarding_visited, setIsOnboardingVisited } = tradinghub;
    /*TODO: We need to show this component whenever user click on tour guide button*/
    const login_id = window.localStorage.getItem('active_loginid') ?? '';
    const real_active = !/^VRT/.test(login_id);
    const [tab_account_type, setTabAccountType] = React.useState<TAccountCategory>(real_active ? 'real' : 'demo');
    const [platform_type, setPlatformType] = React.useState<string>('cfd');
    const [password_manager, setPasswordManager] = React.useState<{
        is_visible: boolean;
        selected_login: string;
        selected_account: string;
        selected_account_type?: string;
        selected_account_group?: string;
        selected_server?: string;
    }>({
        is_visible: false,
        selected_login: '',
        selected_account: '',
        selected_account_type: '',
        selected_account_group: '',
        selected_server: '',
    });

    const history = useHistory();

    type TCurrentList = DetailsOfEachMT5Loginid & {
        enabled: number;
    };

    const existing_accounts_data = (acc_type: 'synthetic' | 'financial') => {
        const should_be_enabled = (list_item: TCurrentList) =>
            platform === 'dxtrade' ? list_item.enabled === 1 : true;
        const acc = Object.keys(current_list).some(
            key => key.startsWith(`${platform}.real.${acc_type}`) && should_be_enabled(current_list[key])
        )
            ? Object.keys(current_list)
                  .filter(key => key.startsWith(`${platform}.real.${acc_type}`))
                  .reduce((_acc, cur) => {
                      _acc.push(current_list[cur]);
                      return _acc;
                  }, [] as DetailsOfEachMT5Loginid[])
            : undefined;
        return acc;
    };

    getRealSyntheticAccountsExistingData(existing_accounts_data('synthetic'));
    getRealFinancialAccountsExistingData(existing_accounts_data('financial'));

    type TOpenAccountTransferMeta = {
        category: string;
        type?: string;
    };

    const openRealPasswordModal = (account_type: TOpenAccountTransferMeta) => {
        setAccountType(account_type);
        enableCFDPasswordModal();
    };

    const accountTypeChange = (event: {
        target: {
            value: string;
            name: string;
        };
    }) => {
        switchAccountHandlerForAppstore(tab_account_type);
        setTabAccountType(event.target.value as TAccountCategory);
    };
    const platformTypeChange = (event: {
        target: {
            value: string;
            name: string;
        };
    }) => {
        setPlatformType(event.target.value);
    };

    const account_toggle_options = [
        { text: 'Real', value: 'real' },
        { text: 'Demo', value: 'demo' },
    ];

    const platform_toggle_options = [
        { text: 'CFD', value: 'cfd' },
        { text: `${is_eu ? 'Multipliers' : 'Options and...'}`, value: 'options' },
    ];

    tour_step_locale.last = (
        <div
            onClick={() => {
                setIsOnboardingVisited(true);
                toggleIsTourOpen(false);
            }}
        >
            <Localize i18n_default_text='OK' />
        </div>
    );

    eu_tour_step_locale.last = (
        <div
            onClick={() => {
                setIsOnboardingVisited(true);
                toggleIsTourOpen(false);
            }}
        >
            <Localize i18n_default_text='OK' />
        </div>
    );

    tour_step_locale.back = (
        <Button
            has_effect
            text={localize('Repeat tour')}
            secondary
            medium
            onClick={() => {
                history.push(routes.onboarding);
                toggleIsTourOpen(true);
            }}
        />
    );

    const togglePasswordManagerModal = (
        login?: string,
        title?: string,
        group?: string,
        type?: string,
        server?: string
    ) => {
        setPasswordManager(prev_state => ({
            is_visible: !prev_state.is_visible,
            selected_login: typeof login === 'string' ? login : '',
            selected_account: typeof title === 'string' ? title : '',
            selected_account_group: group,
            selected_account_type: type,
            selected_server: server,
        }));
    };

    const is_loading = is_populating_mt5_account_list || is_populating_dxtrade_account_list;

    if (is_loading) return <Loading className='cfd-accounts-container__loader' is_fullscreen={false} />;

    return (
        <div id='trading-hub' className='trading-hub'>
            <div className='trading-hub_header'>
                <div className='trading-hub_header--title'>
                    <Text weight='bold' size={isMobile() ? 'xxs' : 'm'} align='left'>
                        {localize("Trader's hub")}
                    </Text>
                </div>
                <div className='trading-hub_header--account'>
                    <TotalAssets category={tab_account_type} className='trading-hub_header--account_assets' />
                    <DesktopWrapper>
                        <ToggleAccountType
                            accountTypeChange={(event: {
                                target: {
                                    value: string;
                                    name: string;
                                };
                            }) => {
                                accountTypeChange(event);
                            }}
                            value={tab_account_type}
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Dropdown
                            id='platfrom_toggle_options'
                            className='trading-hub_header--platfrom_toggle_options'
                            is_alignment_left={false}
                            is_nativepicker={false}
                            list={account_toggle_options}
                            name='multiplier'
                            no_border={true}
                            value={tab_account_type}
                            onChange={accountTypeChange}
                        />
                    </MobileWrapper>
                </div>
            </div>

            <div className='trading-hub_body'>
                <DesktopWrapper>
                    <CFDAccounts account_type={tab_account_type} />
                    <Divider horizontal className='trading-hub_body--divider' />
                    <OptionsAccounts
                        platformlauncherprops={is_eu ? mf_platform_config : platform_config}
                        accountType={tab_account_type}
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <ButtonToggle
                        buttons_arr={platform_toggle_options}
                        className='trading-hub_body--platform_type_toggle'
                        has_rounded_button
                        is_animated
                        name='platforn_type'
                        onChange={platformTypeChange}
                        value={platform_type}
                    />
                    {platform_type === 'cfd' && <CFDAccounts account_type={tab_account_type} />}
                    {platform_type === 'options' && (
                        <OptionsAccounts
                            platformlauncherprops={is_eu ? mf_platform_config : platform_config}
                            accountType={tab_account_type}
                        />
                    )}
                </MobileWrapper>
            </div>
            <Joyride
                run={!is_onboarding_visited && is_tour_open}
                continuous
                disableScrolling
                hideCloseButton
                disableCloseOnEsc
                steps={tour_step_config}
                styles={is_dark_mode_on ? tour_styles_dark_mode : tour_styles}
                locale={tour_step_locale}
                floaterProps={{
                    disableAnimation: true,
                }}
            />
            <JurisdictionModal context={store} openPasswordModal={openRealPasswordModal} />
            <CFDPasswordModal context={store} platform={platform} />
            <CFDDbviOnBoarding context={store} />
            <CFDPersonalDetailsModal context={store} />
            <CFDResetPasswordModal context={store} platform={platform} />
            <CFDServerErrorDialog />
            <CFDTopUpDemoModal context={store} />
            <MT5TradeModal
                context={store}
                current_list={current_list}
                is_open={is_mt5_trade_modal_visible}
                onPasswordManager={togglePasswordManagerModal}
                toggleModal={toggleMT5TradeModal}
                is_eu_user={(is_logged_in && is_eu) || (!is_logged_in && is_eu_country)}
            />
            <CFDPasswordManagerModal
                is_visible={password_manager.is_visible}
                context={store}
                selected_login={password_manager.selected_login}
                selected_account={password_manager.selected_account}
                selected_account_group={password_manager.selected_account_group}
                selected_account_type={password_manager.selected_account_type}
                selected_server={password_manager.selected_server}
                platform={platform}
                toggleModal={togglePasswordManagerModal}
            />
            <ResetTradingPasswordModal context={store} />
        </div>
    );
};

export default observer(TradingHub);
