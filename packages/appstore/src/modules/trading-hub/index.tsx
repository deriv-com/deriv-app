import * as React from 'react';
import Onboarding from 'Components/onboarding';
import { trading_hub_contents } from 'Constants/trading-hub-content';
import Options from 'Components/options';
import platform_config from 'Constants/platform-config';
import Joyride from 'react-joyride';
import ToggleAccountType from 'Components/toggle-account-type';
import { tour_step_config, tour_styles, tour_step_locale, tour_styles_dark_mode } from 'Constants/tour-steps-config';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import CFDAccounts from 'Components/CFDs';
import { TAccountCategory } from 'Types';

const TradingHub: React.FC = () => {
    const { ui } = useStores();
    const { is_dark_mode_on } = ui;
    /*TODO: We need to show this component whenever user click on tour guide button*/
    const [is_tour_open, setIsTourOpen] = React.useState(false);
    const [account_type, setAccountType] = React.useState<TAccountCategory>('demo');

    const accountTypeChange = (event: any) => {
        setAccountType(event.target.value);
    };

    return (
        <React.Fragment>
            <div className='trading-hub'>
                Trading Hub
                <CFDAccounts account_type={account_type} />
            </div>
            <ToggleAccountType accountTypeChange={(event: any) => accountTypeChange(event)} value={account_type} />
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
            <Options platformlauncherprops={platform_config} />
        </React.Fragment>
    );
};

export default observer(TradingHub);
