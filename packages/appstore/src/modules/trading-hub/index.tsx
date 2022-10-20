import * as React from 'react';
import platform_config from 'Constants/platform-config';
import Joyride from 'react-joyride';
import ToggleAccountType from 'Components/toggle-account-type';
import { tour_step_config, tour_styles, tour_step_locale, tour_styles_dark_mode } from 'Constants/tour-steps-config';
import { observer } from 'mobx-react-lite';
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
import CFDAccounts from 'Components/CFDs';
import OptionsAccounts from 'Components/options';
import { TAccountCategory } from 'Types';
import { Localize, localize } from '@deriv/translations';
import { Button } from '@deriv/components';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';
import TotalAssets from 'Components/total-assets';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

const TradingHub: React.FC = () => {
    const store = useStores();
    const { ui, modules, common, client } = useStores();
    const { is_logged_in, is_eu, is_eu_country } = client;
    const {
        setAccountType,
        enableCFDPasswordModal,
        current_list,
        is_mt5_trade_modal_visible,
        togglePasswordManagerModal,
        toggleMT5TradeModal,
        getRealSyntheticAccountsExistingData,
        getRealFinancialAccountsExistingData,
    } = modules.cfd;
    const { platform } = common;
    const { is_dark_mode_on, is_tour_open, toggleIsTourOpen } = ui;
    /*TODO: We need to show this component whenever user click on tour guide button*/
    const [tab_account_type, setTabAccountType] = React.useState<TAccountCategory>('real');
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

    const accountTypeChange = (event: any) => {
        setTabAccountType(event.target.value);
    };

    tour_step_locale.last = (
        <Localize
            i18n_default_text='OK'
            onClick={() => {
                toggleIsTourOpen();
            }}
        />
    );

    tour_step_locale.back = (
        <Button
            has_effect
            text={localize('Repeat tour')}
            secondary
            medium
            onClick={() => {
                history.push(routes.onboarding);
                toggleIsTourOpen();
            }}
        />
    );

    return (
        <React.Fragment>
            <div>
                <TotalAssets category={tab_account_type} />
                <ToggleAccountType
                    accountTypeChange={(event: any) => accountTypeChange(event)}
                    value={tab_account_type}
                />
            </div>

            <div className='trading-hub__body'>
                <CFDAccounts account_type={tab_account_type} />
            </div>
            <Joyride
                run={is_tour_open}
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
            <OptionsAccounts platformlauncherprops={platform_config} accountType={tab_account_type} />
            <JurisdictionModal context={store} openPasswordModal={openRealPasswordModal} />
            <CFDPasswordModal context={store} platform={platform} />
            <CFDDbviOnBoarding context={store} />
            <CFDPersonalDetailsModal context={store} />
            <CFDResetPasswordModal context={store} platform={platform} />
            <CFDTopUpDemoModal context={store} />
            <MT5TradeModal
                context={store}
                current_list={current_list}
                is_open={is_mt5_trade_modal_visible}
                onPasswordManager={togglePasswordManagerModal}
                toggleModal={toggleMT5TradeModal}
                is_eu_user={(is_logged_in && is_eu) || (!is_logged_in && is_eu_country)}
            />
            <CFDPasswordManagerModal context={store} platform={platform} toggleModal={togglePasswordManagerModal} />
            <ResetTradingPasswordModal context={store} />
        </React.Fragment>
    );
};

export default observer(TradingHub);
