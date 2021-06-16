import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, MobileWrapper, StaticUrl } from '@deriv/components';
import Logo from 'Assets/SvgComponents/header/deriv-onboarding-logo.svg';
import LogoMobile from 'Assets/SvgComponents/header/deriv-onboarding-logo-mobile.svg';

const SignupOnboardingHeader = () => {
    return (
        <header className={classNames('signup-onboarding-header')}>
            <div className={classNames('signup-onboarding-header__menu-center')}>
                <StaticUrl href='/'>
                    <DesktopWrapper>
                        <Logo className='signup-onboarding-header__menu-center-icon' />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <LogoMobile className='signup-onboarding-header__menu-center-icon' />
                    </MobileWrapper>
                </StaticUrl>
            </div>
        </header>
    );
};

SignupOnboardingHeader.propTypes = {
    setDarkMode: PropTypes.func,
    is_dark_mode: PropTypes.bool,
};

export default SignupOnboardingHeader;
