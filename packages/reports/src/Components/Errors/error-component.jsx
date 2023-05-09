import PropTypes from 'prop-types';
import React from 'react';
import { Dialog, PageErrorContainer } from '@deriv/components';
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

    if (is_dialog) {
        return (
            <Dialog
                title={header || localize('There was an error')}
                is_visible
                confirm_button_text={redirect_label || localize('Ok')}
                onConfirm={redirectOnClick || (() => location.reload())}
            >
                {message || localize('Sorry, an error occured while processing your request.')}
            </Dialog>
        );
    }
    return (
        <PageErrorContainer
            error_header={header ?? ''}
            error_messages={message ? message[(message, refresh_message)] : []}
            redirect_urls={[routes.trade]}
            redirect_labels={[redirect_label || localize('Refresh')]}
            buttonOnClick={redirectOnClick || (() => location.reload())}
        />
    );
};

ErrorComponent.propTypes = {
    header: PropTypes.string,
    is_dialog: PropTypes.bool,
    message: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    redirect_label: PropTypes.string,
    redirectOnClick: PropTypes.func,
    should_show_refresh: PropTypes.bool,
    type: PropTypes.string,
};

export default ErrorComponent;
