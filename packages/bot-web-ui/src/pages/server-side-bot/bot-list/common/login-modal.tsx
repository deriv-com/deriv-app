import React from 'react';
import { Dialog, Icon, Text } from '@deriv/components';
import { getLanguage, localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { redirectToLogin, redirectToSignUp } from '@deriv/shared';
import './login-modal.scss';

type TLoginModal = {
    is_login_modal_visible: boolean;
    setLoginModalVisble: (value: boolean) => void;
};

const loginModal = observer(({ is_login_modal_visible, setLoginModalVisble }: TLoginModal) => {
    return (
        <div>
            <Dialog
                title={localize('You are not logged in')}
                is_visible={is_login_modal_visible}
                confirm_button_text={localize('Sign Up')}
                onConfirm={() => {
                    setLoginModalVisble(false);
                    redirectToSignUp();
                }}
                cancel_button_text={localize('Log in')}
                onCancel={() => {
                    setLoginModalVisble(false);
                    redirectToLogin(false, getLanguage());
                }}
                is_mobile_full_width={false}
                className={'serverbot__dialog'}
                has_close_icon={false}
            >
                <div
                    className='serverbot__dialog--cross'
                    onClick={() => {
                        setLoginModalVisble(false);
                    }}
                >
                    <Icon icon='IcCross' />
                </div>
                <div>
                    <Text color='prominent' line_height='xl' size='xs'>
                        {localize('Please log in or sign up to start trading with us.')}
                    </Text>
                </div>
            </Dialog>
        </div>
    );
});

export default loginModal;
