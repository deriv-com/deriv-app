import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '@deriv/components';
import { redirectToLogin } from '_common/base/login';
import { localize, Localize } from '@deriv/translations';

const LoginButton = ({ className }) => (
    <>
        <Localize
            i18n_default_text='Want to exchange between e-wallet currencies? Try <0>bestchange.com</0>'
            components={[
                <a
                    key={0}
                    href='https://www.bestchange.com/?p=1095016'
                    rel='noopener noreferrer'
                    target='_blank'
                    className='link'
                />,
            ]}
        />{' '}
        <Button
            id='dt_login_button'
            className={className}
            has_effect
            text={localize('Log in')}
            onClick={redirectToLogin}
            tertiary
        />
    </>
);

LoginButton.propTypes = {
    className: PropTypes.string,
};

export { LoginButton };
