import * as React from 'react';
import Onboarding from 'Components/onboarding';
import { trading_hub_contents } from 'Constants/trading-hub-content';
import Joyride from 'react-joyride';
import ToggleAccountType from 'Components/toggle-account-type';
import { tour_step_config, tour_styles, tour_step_locale } from 'Constants/tour-steps-config';

const TradingHub = () => {
    /*TODO: We need to show this component whenever user click on tour guide button*/
    const [is_tour_open, setIsTourOpen] = React.useState(false);

    return (
        <React.Fragment>
            <ToggleAccountType accountTypeChange value={''} />
            <Joyride
                run={is_tour_open}
                continuous
                callback={() => is_tour_open}
                disableScrolling
                hideCloseButton
                disableCloseOnEsc
                steps={tour_step_config}
                styles={tour_styles}
                locale={tour_step_locale}
            />
            <Onboarding contents={trading_hub_contents} setIsTourOpen={setIsTourOpen} />
        </React.Fragment>
    );
};

export default TradingHub;
