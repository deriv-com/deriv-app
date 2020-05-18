import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@deriv/components';
import { getDerivComLink } from '@deriv/shared/utils/url';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const CookieBanner = ({ onAccept, is_open, is_dark_mode_on }) => (
    <div
        className={classNames('cookie-banner', {
            'theme-dark': is_dark_mode_on,
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
        <Button className='btn-accept' secondary onClick={onAccept}>
            {localize('Accept')}
        </Button>
    </div>
);

CookieBanner.prototype = {
    is_open: PropTypes.bool,
    onAccept: PropTypes.func,
};

export default connect(({ ui }) => ({
    is_dark_mode_on: ui.is_dark_mode_on,
}))(CookieBanner);
