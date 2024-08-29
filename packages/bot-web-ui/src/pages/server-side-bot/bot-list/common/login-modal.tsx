import React from 'react';
import { Dialog, Icon, Text } from '@deriv/components';
import { redirectToLogin, redirectToSignUp } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { getLanguage, Localize, localize } from '@deriv/translations';
import './login-modal.scss';

type TLoginModal = {
    is_login_modal_visible: boolean;
    setLoginModalVisble: (value: boolean) => void;
};

const LoginModal: React.FC<TLoginModal> = observer(({ is_login_modal_visible, setLoginModalVisble }) => {
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
                className='ssb-login__dialog'
                has_close_icon={false}
            >
                <div
                    className='ssb-login__dialog--cross'
                    onClick={() => {
                        setLoginModalVisble(false);
                    }}
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter') {
                            setLoginModalVisble(false);
                        }
                    }}
                >
                    <Icon icon='IcCross' />
                </div>
                <div>
                    <Text color='prominent' line_height='xl' size='xs'>
                        <Localize i18n_default_text='Please log in or sign up to start trading with us.' />
                    </Text>
                </div>
            </Dialog>
        </div>
    );
});

export default LoginModal;
