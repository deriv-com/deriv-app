import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { getDerivComLink } from '@deriv/shared/utils/url';
import { localize, Localize } from '@deriv/translations';
import { Button } from '@deriv/components';

const CookieBanner = ({ onAccept, is_open }) => (
    <div
        className={classNames('cookie-banner', {
            'is-open': is_open,
            'is-closed': !is_open,
        })}
    >
        <Localize
            i18n_default_text='Our website uses cookies to give you the best user experience. For more information, <0>view our policy</0>.'
            components={[
                <a
                    key={0}
                    className='link link--red'
                    rel='noopener noreferrer'
                    target='_blank'
                    href={getDerivComLink('/terms-and-conditions')}
                />,
            ]}
        />
        <br />
        <br />
        <Button className='btn-accept' secondary onClick={onAccept}>
            {localize('Accept')}
        </Button>
    </div>
);

CookieBanner.prototype = {
    is_open: PropTypes.bool,
    onAccept: PropTypes.func,
};

export default CookieBanner;
