import React from 'react';
import { Icon, Popover, StaticUrl } from '@deriv/components';
import { localize } from '@deriv/translations';

const SecurityAndPrivacy: React.FC = () => (
    <Popover alignment='top' zIndex='10' message={localize('Security and privacy')}>
        <StaticUrl className='footer__link' href='tnc/security-and-privacy.pdf' is_document>
            <Icon icon='IcSecurityAndPrivacy' />
        </StaticUrl>
    </Popover>
);

export default SecurityAndPrivacy;
