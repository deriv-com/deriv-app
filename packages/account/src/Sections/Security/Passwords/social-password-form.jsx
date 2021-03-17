import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const SocialPasswordForm = () => (
    <div className='account__passwords-item-right passwords-social-buttons'>
        <div className='account__passwords-linked'>
            <Icon icon='IcStockGoogle' size={16} />
            <Text size='xs'>{localize('Linked with Google')}</Text>
        </div>
        <Button className='account__passwords-footer-btn' type='button' text={localize('Unlink')} tertiary large />
    </div>
);

export default SocialPasswordForm;
