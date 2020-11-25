import PropTypes from 'prop-types';
import React from 'react';
import { PageError, Dialog } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';

const ErrorComponent = ({
    header,
    message,
    is_dialog,
    redirect_label,
    redirectOnClick,
    should_show_refresh = true,
}) => {
    const refresh_message = should_show_refresh ? localize('Please refresh this page to continue.') : '';

    return is_dialog ? (
        <Dialog
            title={header || localize('There was an error')}
            is_visible
            confirm_button_text={redirect_label || localize('Ok')}
            onConfirm={redirectOnClick || (() => location.reload())}
        >
            {message || localize('Sorry, an error occured while processing your request.')}
        </Dialog>
    ) : (
        <PageError
            header={header || localize('Something’s not right')}
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
    message: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    type: PropTypes.string,
};

export default ErrorComponent;
