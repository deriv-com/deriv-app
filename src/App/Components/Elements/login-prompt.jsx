import PropTypes    from 'prop-types';
import React        from 'react';
import { urlFor }   from '_common/url';
import PageError    from 'Modules/PageError';
import Localize     from './localize.jsx';

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
                    <a key={0} className='link' href='javascript:;' onClick={onLogin} />,
                    <a key={1} className='link' href='javascript:;' onClick={onSignup} />,
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

// TODO - Remove this default setting once sign-up has been integrated to app 2
LoginPrompt.defaultProps = {
    onSignup: () => { window.open(urlFor('new-account', undefined, undefined, true)); },
};

export default LoginPrompt;

