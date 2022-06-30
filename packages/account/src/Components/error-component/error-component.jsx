import PropTypes from 'prop-types';
import React from 'react';
import { PageError } from '@deriv/components';
import { localize } from '@deriv/translations';
import { routes } from '@deriv/shared';

const ErrorComponent = ({ header, message, redirect_label, redirectOnClick, should_show_refresh = true }) => {
    const refresh_message = should_show_refresh ? localize('Please refresh this page to continue.') : '';

    return (
        <PageError
            header={header || localize('Oops, something went wrong.')}
            messages={
                message
                    ? [message, refresh_message]
                    : [localize('Sorry, an error occured while processing your request.'), refresh_message]
            }
            redirect_urls={[routes.trade]}
            redirect_labels={[redirect_label || localize('Refresh')]}
            buttonOnClick={redirectOnClick || (() => location.reload())}
        />
    );
};

ErrorComponent.propTypes = {
    header: PropTypes.element,
    message: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    redirect_label: PropTypes.element,
    redirectOnClick: PropTypes.func,
    should_show_refresh: PropTypes.bool,
    type: PropTypes.string,
};

export default ErrorComponent;
