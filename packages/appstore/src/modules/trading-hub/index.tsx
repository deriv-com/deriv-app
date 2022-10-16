import * as React from 'react';
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
    CFDFinancialStpRealAccountSignup,
    MT5TradeModal,
    CFDPasswordManagerModal,
} from '@deriv/cfd';
import CFDAccounts from 'Components/CFDs';
import { TAccountCategory } from 'Types';
import { Localize, localize } from '@deriv/translations';
import { Button } from '@deriv/components';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';

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
    } = modules.cfd;
    const { platform } = common;
    const { is_dark_mode_on, is_tour_open, toggleIsTourOpen } = ui;
    /*TODO: We need to show this component whenever user click on tour guide button*/
    const [tab_account_type, setTabAccountType] = React.useState<TAccountCategory>('real');
    const history = useHistory();

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
            <ToggleAccountType accountTypeChange={(event: any) => accountTypeChange(event)} value={tab_account_type} />
            <div className='trading-hub'>
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
            {/* <Onboarding contents={trading_hub_contents} setIsTourOpen={setIsTourOpen} /> */}
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
            <CFDPasswordManagerModal context={store} platform={platform} />
            <ResetTradingPasswordModal context={store} />
            {/* <CFDFinancialStpRealAccountSignup context={store} /> */}
        </React.Fragment>
    );
};

export default observer(TradingHub);
