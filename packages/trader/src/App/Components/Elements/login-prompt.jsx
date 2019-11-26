import PropTypes    from 'prop-types';
import React        from 'react';
import PageError    from 'Modules/PageError';
import { Localize } from 'deriv-translations';

const LoginPrompt = ({
    onLogin,
    onSignup,
    page_title,
}) => (
    <PageError
        header={
            <Localize
                i18n_default_text='{{page_title}} page is only<0 />available for existing clients.'
                values={{ page_title: page_title || 'This' }}
                components={[ <br key={0} /> ]}
            />
        }
        messages={[
            <Localize
                key={0}
                i18n_default_text='If you have an active account, please <0>Log in</0> for full access. Otherwise, please <1>Sign up</1> to start trading.'
                components={[
                    <a key={0} className='link' onClick={onLogin} />,
                    <a key={1} className='link' onClick={onSignup} />,
                ]}
            />,
        ]}
    />
);

LoginPrompt.propTypes = {
    onLogin   : PropTypes.func,
    onSignup  : PropTypes.func,
    page_title: PropTypes.string,
};

export default LoginPrompt;

