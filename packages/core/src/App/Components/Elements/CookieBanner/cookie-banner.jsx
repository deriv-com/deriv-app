import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@deriv/components';
import { getStaticUrl, PlatformContext } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

const CookieBanner = ({ onAccept, onDecline, is_open, is_dark_mode }) => {
    const { is_deriv_crypto } = React.useContext(PlatformContext);

    return (
        <div
            className={classNames('cookie-banner', {
                'cookie-banner--is-closed': !is_open,
                'cookie-banner--theme-dark': is_dark_mode,
            })}
        >
            <div className='description'>
                <Localize i18n_default_text='Cookies help us to give you a better experience and personalised content on our site.' />
                <br />
                <Localize
                    i18n_default_text='If you agree to our use of cookies, click on Accept. For more information, <0>see our policy</0>.'
                    components={[
                        <a
                            key={0}
                            className='link link--red'
                            rel='noopener noreferrer'
                            target='_blank'
                            href={getStaticUrl('/terms-and-conditions', { is_deriv_crypto })}
                        />,
                    ]}
                />
                <Button className='cookie-banner__btn-dont-accept' secondary onClick={onDecline}>
                    {localize('Don’t accept')}
                </Button>
                <Button className='cookie-banner__btn-accept' secondary onClick={onAccept}>
                    {localize('Accept')}
                </Button>
            </div>
        </div>
    );
};

CookieBanner.prototype = {
    is_dark_mode: PropTypes.bool,
    is_open: PropTypes.bool,
    onAccept: PropTypes.func,
    onDecline: PropTypes.func,
};

export default CookieBanner;
