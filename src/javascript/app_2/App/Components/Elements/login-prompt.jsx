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
                str='[_1] page is only[_2]available for existing clients.'
                replacers={{
                    '1': page_title || 'This',
                    '2': <br key={0} />,
                }}
            />
        }
        messages={[
            <Localize
                key={0}
                str='If you have an active account, please [_1]Log in[_2] for full access. Otherwise, please [_3]Sign up[_4] to start trading.'
                replacers={{
                    '1_2': <a className='link' href='javascript:;' onClick={onLogin} />,
                    '3_4': <a className='link' href='javascript:;' onClick={onSignup} />,
                }}
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

