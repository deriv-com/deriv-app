import * as React from 'react';
import Onboarding from 'Components/onboarding';
import { trading_hub_contents } from 'Constants/trading-hub-content';
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

const TradingHub: React.FC = () => {
    const store = useStores();
    const { ui, modules } = useStores();
    const { setAccountType, enableCFDPasswordModal } = modules.cfd;
    const { is_dark_mode_on } = ui;
    /*TODO: We need to show this component whenever user click on tour guide button*/
    const [is_tour_open, setIsTourOpen] = React.useState(false);
    const [tab_account_type, setTabAccountType] = React.useState<TAccountCategory>('real');

    type TOpenAccountTransferMeta = {
        category: string;
        type?: string;
    };

    const openRealPasswordModal = (
        account_type: TOpenAccountTransferMeta = { category: 'real', type: 'financial' }
    ) => {
        setAccountType(account_type);
        enableCFDPasswordModal();
    };

    const accountTypeChange = (event: any) => {
        setTabAccountType(event.target.value);
    };

    return (
        <React.Fragment>
            <div className='trading-hub'>
                Trading Hub
                <CFDAccounts account_type={tab_account_type} />
            </div>
            <ToggleAccountType accountTypeChange={(event: any) => accountTypeChange(event)} value={tab_account_type} />
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
            <Onboarding contents={trading_hub_contents} setIsTourOpen={setIsTourOpen} />
            <JurisdictionModal context={store} openPasswordModal={openRealPasswordModal} />
            <CFDPasswordModal context={store} />
            <CFDDbviOnBoarding context={store} />
            <CFDPersonalDetailsModal context={store} />
            <CFDResetPasswordModal context={store} />
            <CFDTopUpDemoModal context={store} />
            <MT5TradeModal context={store} />
            <CFDPasswordManagerModal context={store} />
            <ResetTradingPasswordModal context={store} />
            <CFDFinancialStpRealAccountSignup context={store} />
        </React.Fragment>
    );
};

export default observer(TradingHub);
