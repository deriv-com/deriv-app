import React from 'react';
import PropTypes from 'prop-types';
import { routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { DesktopWrapper, MobileWrapper, Text } from '@deriv/components';
import CFDs from 'Assets/PngComponents/onboarding/cfds.png';
import CFDsMobile from 'Assets/PngComponents/onboarding/cfds-mobile.png';
import DigitalOptions from 'Assets/PngComponents/onboarding/digital-options.png';
import DigitalOptionsMobile from 'Assets/PngComponents/onboarding/digital-options-mobile.png';
import Multipliers from 'Assets/PngComponents/onboarding/multipliers.png';
import MultipliersMobile from 'Assets/PngComponents/onboarding/multipliers-mobile.png';
import NotSure from 'Assets/PngComponents/onboarding/not-sure.png';
import NotSureMobile from 'Assets/PngComponents/onboarding/not-sure-mobile.png';
import WelcomeItem from './welcome-item.jsx';

const Welcome = ({ is_eu, country_standpoint, switchPlatform, can_have_mf_account, can_have_mlt_account }) => {
    const is_uk = country_standpoint.is_united_kingdom;
    const is_mlt_mf = can_have_mf_account && can_have_mlt_account;
    const is_mf_only = can_have_mf_account && !can_have_mlt_account;

    const shouldShowOptions = () => {
        let show_options = true;
        if (is_eu || is_uk) {
            show_options = false;
        }
        return show_options;
    };
    const cfdOptions = () => {
        let country_options;
        if (is_uk) {
            country_options = ['Forex', 'Stocks', 'Stock indices', 'Commodities'];
        } else if (is_eu) {
            country_options = ['Forex', 'Synthetics', 'Stocks', 'Stock indices', 'Cryptocurrencies', 'Commodities'];
        } else {
            country_options = ['Forex', 'Synthetics', 'Stocks and indices', 'Cryptocurrencies', 'Commodities'];
        }
        return country_options;
    };
    const mfOptions = () => {
        let mf_options;
        if (is_mlt_mf || is_mf_only) {
            mf_options = ['Forex', 'Synthetics', 'Cryptocurrencies'];
        } else if (is_uk) {
            mf_options = ['Forex'];
        } else {
            mf_options = ['Forex', 'Synthetics'];
        }
        return mf_options;
    };
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
                    options={cfdOptions()}
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
                    options={mfOptions()}
                />
                {shouldShowOptions() && (
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

                <WelcomeItem
                    description={<Localize i18n_default_text='Let us introduce you to trading on Deriv.' />}
                    title={localize('Not sure?')}
                    onClick={() => switchPlatform({ route: routes.trade })}
                    icon={<NotSure />}
                    mobileIcon={<NotSureMobile />}
                />
            </div>
        </>
    );
};

Welcome.propTypes = {
    can_have_mf_account: PropTypes.bool,
    can_have_mlt_account: PropTypes.bool,
    country_standpoint: PropTypes.object,
    is_eu: PropTypes.bool,
    switchPlatform: PropTypes.func.isRequired,
};

export default Welcome;
