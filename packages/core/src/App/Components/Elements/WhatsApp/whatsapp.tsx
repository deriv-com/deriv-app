import React, { Fragment } from 'react';

import { Icon, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';

const WhatsApp = ({ showPopover, onClick }: { showPopover?: boolean; onClick?: () => void }) => {
    const { isDesktop } = useDevice();

    if (!isDesktop)
        return (
            <Fragment>
                <Icon icon='IcWhatsApp' className='drawer-icon' />
                <a
                    className='header__menu-mobile-whatsapp-link'
                    href={URLConstants.whatsApp}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={onClick}
                >
                    {localize('WhatsApp')}
                </a>
            </Fragment>
        );

    return (
        <a
            href={URLConstants.whatsApp}
            aria-label={localize('WhatsApp')}
            className='footer__link'
            target='_blank'
            rel='noreferrer'
        >
            {showPopover ? (
                <Popover
                    classNameBubble='whatsapp__tooltip'
                    alignment='top'
                    message={localize('WhatsApp')}
                    zIndex='9999'
                >
                    <Icon icon='IcWhatsApp' className='footer__icon' />
                </Popover>
            ) : (
                <Icon icon='IcWhatsApp' className='footer__icon' />
            )}
        </a>
    );
};

export default WhatsApp;
