import * as React from 'react';
import Onboarding from 'Components/onboarding';
import { trading_hub_contents } from 'Constants/trading-hub-content';
// import AddOptionsAccount from 'Components/add-options-account';
import Joyride from 'react-joyride';
import ToggleAccountType from 'Components/toggle-account-type';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const TradingHub = () => {
    /*TODO: We need to show this component whenever user click on tour guide button*/
    const [is_tour_open, setIsTourOpen] = React.useState(false);

    return (
        <React.Fragment>
            {/* <AddOptionsAccount /> */}
            <ToggleAccountType accountTypeChange value={''} />
            <Joyride
                run={is_tour_open}
                continuous
                callback={() => is_tour_open}
                disableScrolling
                hideCloseButton
                steps={[
                    {
                        title: (
                            <Text
                                styles={{ color: 'var(--brand-red-coral)' }}
                                weight='bold'
                                as='p'
                                className='tour-guide__title'
                            >
                                {localize('Switch accounts')}
                            </Text>
                        ),
                        content: 'You can switch between real and demo accounts',
                        target: '.toggle-account-type__button',
                        disableBeacon: true,
                        placement: 'bottom-end',
                    },
                    {
                        title: (
                            <Text
                                styles={{ color: 'var(--brand-red-coral)' }}
                                weight='bold'
                                as='p'
                                className='tour-guide__title'
                            >
                                {localize('Trading Hub tour')}
                            </Text>
                        ),
                        content: `Need help moving around?
                             We have a short turorial that might help. Hit Repeat Tour to begin`,
                        target: '.trading-hub-header__tradinghub--onboarding--logo',
                        disableBeacon: true,
                    },
                ]}
                styles={{
                    options: {
                        width: 350,
                    },
                }}
                locale={{
                    back: <div onClick={undefined}>{localize('Repeat tour')}</div>,
                    close: localize('Close'),
                    last: localize('OK'),
                    next: localize('Next'),
                    skip: localize('Skip'),
                }}
            />
            <Onboarding contents={trading_hub_contents} setIsTourOpen={setIsTourOpen} />
        </React.Fragment>
    );
};

export default TradingHub;
