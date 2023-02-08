import React from 'react';
import PropTypes from 'prop-types';
import { routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { DesktopWrapper, MobileWrapper, StaticUrl, Text } from '@deriv/components';
import CFDs from 'Assets/SvgComponents/onboarding/cfds.svg';
import CFDsMobile from 'Assets/SvgComponents/onboarding/cfds-mobile.svg';
import DigitalOptions from 'Assets/SvgComponents/onboarding/digital-options.svg';
import DigitalOptionsMobile from 'Assets/SvgComponents/onboarding/digital-options-mobile.svg';
import Multipliers from 'Assets/SvgComponents/onboarding/multipliers.svg';
import MultipliersMobile from 'Assets/SvgComponents/onboarding/multipliers-mobile.svg';
import NotSure from 'Assets/SvgComponents/onboarding/not-sure.svg';
import NotSureMobile from 'Assets/SvgComponents/onboarding/not-sure-mobile.svg';
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
            country_options = ['Forex', 'Derived', 'Stocks', 'Stock indices', 'Cryptocurrencies', 'Commodities'];
        } else {
            country_options = ['Forex', 'Derived', 'Stocks and indices', 'Cryptocurrencies', 'Commodities'];
        }
        return country_options;
    };
    const mfOptions = () => {
        let mf_options;
        if (is_mlt_mf || is_mf_only) {
            mf_options = ['Forex', 'Derived', 'Cryptocurrencies'];
        } else if (is_uk) {
            mf_options = ['Forex'];
        } else {
            mf_options = ['Forex', 'Derived'];
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
                        options={is_eu ? ['Derived'] : ['Forex', 'Derived', 'Stocks and indices', 'Commodities']}
                    />
                )}
                {!is_eu && (
                    <WelcomeItem
                        description={
                            <Localize
                                i18n_default_text='Get more info on <0>CFDs</0>, <1>multipliers</1>, and <2>options</2>.'
                                components={[
                                    <StaticUrl key={0} className='link' href='/trade-types/cfds/' />,
                                    <StaticUrl key={1} className='link' href='/trade-types/multiplier/' />,
                                    <StaticUrl key={2} className='link' href='/trade-types/options/' />,
                                ]}
                            />
                        }
                        title={localize('Not sure where to start?')}
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
    can_have_mf_account: PropTypes.bool,
    can_have_mlt_account: PropTypes.bool,
    country_standpoint: PropTypes.object,
    is_eu: PropTypes.bool,
    switchPlatform: PropTypes.func.isRequired,
};

export default Welcome;
