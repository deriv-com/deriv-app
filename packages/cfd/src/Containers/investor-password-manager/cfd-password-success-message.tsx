import React from 'react';
import { Text, Button, Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { TCFDPasswordSuccessMessage } from '../props.types';

const CFDPasswordSuccessMessage = ({ toggleModal, is_investor }: TCFDPasswordSuccessMessage) => (
    <div className='cfd-password-manager__success'>
        <Icon icon='IcPasswordUpdated' size={128} />
        <Text as='p' size='xxs' align='center'>
            {is_investor ? (
                <Localize i18n_default_text='Your investor password has been changed.' />
            ) : (
                <Localize i18n_default_text='Your password has been changed.' />
            )}
        </Text>
        <Button onClick={toggleModal} className='cfd-password-manager__success-btn' primary large>
            <p className='dc-btn__text'>{localize('OK')}</p>
        </Button>
    </div>
);

export default CFDPasswordSuccessMessage;
