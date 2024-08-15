import React from 'react';
import { StaticUrl } from '@deriv/components';
import DerivBrandShortLogo from 'Assets/SvgComponents/header/deriv-logo-short.svg';

const DerivShortLogo = () => {
    return (
        <div className='header__menu-left-logo'>
            <StaticUrl href='/'>
                <DerivBrandShortLogo />
            </StaticUrl>
        </div>
    );
};

export default DerivShortLogo;
