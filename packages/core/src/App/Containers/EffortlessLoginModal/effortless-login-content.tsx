import FormBody from '@deriv/account/src/Components/form-body';
import EffortlessLoginModalWrapper from './effortless-login-modal-wrapper';
import { Button, Icon, Text } from '@deriv/components';
import React from 'react';
import FormFooter from '@deriv/account/src/Components/form-footer';
import { Localize } from '@deriv/translations';
import { EffortLessLoginTips } from './effortless-login-tips';

const EffortlessLoginContent = () => (
    <EffortlessLoginModalWrapper>
        <FormBody scroll_offset='15rem' className='effortless-login-modal__wrapper'>
            <Icon icon='IcInfoPasskey' size={96} />
            <Text
                as='div'
                color='general'
                weight='bold'
                size='s'
                align='center'
                className='effortless-login-modal__title'
            >
                Effortless login with passkeys
            </Text>
            <EffortLessLoginTips />
        </FormBody>
        <FormFooter className='effortless-login-modal__footer'>
            <Button
                type='button'
                has_effect
                primary
                // onClick={() => {
                // }}
            >
                <Localize i18n_default_text='Create passkey' />
            </Button>
        </FormFooter>
    </EffortlessLoginModalWrapper>
);

export default EffortlessLoginContent;
