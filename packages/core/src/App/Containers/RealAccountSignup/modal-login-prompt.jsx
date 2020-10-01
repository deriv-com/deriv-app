import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { redirectToLogin, redirectToSignUp } from '_common/base/login';
import 'Sass/modal-login-prompt.scss';
import { PlatformContext } from '@deriv/shared';

const ModalLoginPrompt = () => {
    const { is_deriv_crypto } = React.useContext(PlatformContext);

    return (
        <div className='modal-login-prompt'>
            <h2>{localize('This is only available for existing clients.')}</h2>
            <p>{localize('If you have an active account, please log in to continue. Otherwise, please sign up.')}</p>

            <div>
                <Button secondary text={localize('Log In')} onClick={redirectToLogin} />
                <Button primary text={localize('Sign Up')} onClick={() => redirectToSignUp({ is_deriv_crypto })} />
            </div>
        </div>
    );
};

export default ModalLoginPrompt;
