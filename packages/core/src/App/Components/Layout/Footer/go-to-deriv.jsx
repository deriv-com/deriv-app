import React from 'react';
import { Icon, Popover, StaticUrl } from '@deriv/components';
import { localize } from '@deriv/translations';
import { deriv_urls, isTabletOs } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';

export const GoToDeriv = () => {
    const message = localize('Go to {{hostname}}', { hostname: deriv_urls.DERIV_HOST_NAME });
    const { isDesktop } = useDevice();

    return (
        <StaticUrl href='/' className='footer__link'>
            {isDesktop && !isTabletOs ? (
                <Popover alignment='top' message={message} zIndex={9999}>
                    <Icon icon='IcDerivOutline' className='footer__icon ic-deriv__icon' />
                </Popover>
            ) : (
                <Icon icon='IcDerivOutline' className='footer__icon ic-deriv__icon' />
            )}
        </StaticUrl>
    );
};
