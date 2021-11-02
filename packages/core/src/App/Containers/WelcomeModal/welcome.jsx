import React from 'react';
import PropTypes from 'prop-types';
import { routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { Text, MobileWrapper, DesktopWrapper } from '@deriv/components';
import CFDs from 'Assets/SvgComponents/onboarding/cfds.svg';
import CFDsMobile from 'Assets/SvgComponents/onboarding/cfds-mobile.svg';
import DigitalOptions from 'Assets/SvgComponents/onboarding/digital-options.svg';
import DigitalOptionsMobile from 'Assets/SvgComponents/onboarding/digital-options-mobile.svg';
import Multipliers from 'Assets/SvgComponents/onboarding/multipliers.svg';
import MultipliersMobile from 'Assets/SvgComponents/onboarding/multipliers-mobile.svg';
import NotSure from 'Assets/SvgComponents/onboarding/not-sure.svg';
import NotSureMobile from 'Assets/SvgComponents/onboarding/not-sure-mobile.svg';
import WelcomeItem from './welcome-item.jsx';

const Welcome = ({ is_eu, country_standpoint, switchPlatform }) => {
    const should_show_options = is_eu
        ? country_standpoint.is_rest_of_eu || !country_standpoint.is_united_kingdom
        : true;
    return (
        <>
            <DesktopWrapper>
                <Text as='h2' weight='bold' align='center' color='prominent' className='welcome__header' size='m'>
                    {localize('Where would you like to start?')}
                </Text>
            </DesktopWrapper>
            <MobileWrapper>
                <Text as='h2' weight='bold' align='center' color='prominent' className='welcome__header' size='xsm'>
                    {localize('Where would you like to start?')}
                </Text>
            </MobileWrapper>
            <div className='welcome__main'>
                <WelcomeItem
                    title={localize('CFDs')}
                    description={
                        <Localize
                            i18n_default_text='<0>Maximise returns </0> by <0>risking more</0> than you put in.'
                            components={[<Text key={0} weight='bold' as='strong' color='prominent' />]}
                        />
                    }
                    onClick={() => switchPlatform({ route: routes.mt5 })}
                    icon={<CFDs />}
                    mobileIcon={<CFDsMobile />}
                    options={
                        is_eu
                            ? ['Forex', 'Synthetics', 'Stocks', 'Stock indices', 'Cryptocurrencies', 'Commodities']
                            : ['Forex', 'Synthetics', 'Stocks and indices', 'Cryptocurrencies', 'Commodities']
                    }
                />
                <WelcomeItem
                    description={
                        <Localize
                            i18n_default_text='<0>Multiply returns </0> by <0>risking only</0> what you put in.'
                            components={[<Text key={0} weight='bold' as='strong' color='prominent' />]}
                        />
                    }
                    onClick={() => switchPlatform({ should_show_multiplier: true, route: routes.trade })}
                    title={localize('Multipliers')}
                    icon={<Multipliers />}
                    mobileIcon={<MultipliersMobile />}
                    options={['Forex', 'Synthetics']}
                />
                {should_show_options && (
                    <WelcomeItem
                        description={
                            <Localize
                                i18n_default_text='Earn <0>fixed returns </0> by <0>risking only</0> what you put in.'
                                components={[<Text key={0} weight='bold' as='strong' color='prominent' />]}
                            />
                        }
                        onClick={() => switchPlatform({ route: routes.trade })}
                        title={localize('Options')}
                        icon={<DigitalOptions />}
                        mobileIcon={<DigitalOptionsMobile />}
                        options={is_eu ? ['Synthetics'] : ['Forex', 'Synthetics', 'Stocks and indices', 'Commodities']}
                    />
                )}
                {!is_eu && (
                    <WelcomeItem
                        description={
                            <Localize
                                i18n_default_text='Let us introduce you to trading on Deriv.'
                                components={[<Text key={0} weight='bold' as='strong' color='prominent' />]}
                            />
                        }
                        onClick={() => switchPlatform({ route: routes.trade })}
                        title={localize('Not sure?')}
                        icon={<NotSure />}
                        mobileIcon={<NotSureMobile />}
                        small
                    />
                )}
            </div>
        </>
    );
};

Welcome.propTypes = {
    country_standpoint: PropTypes.object,
    is_eu: PropTypes.bool,
    switchPlatform: PropTypes.func.isRequired,
};

export default Welcome;
