import React from 'react';
import { Dialog, PageErrorContainer } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';

type TErrorComponent = {
    header: React.ReactNode;
    message: React.ReactNode;
    is_dialog: boolean;
    redirect_label: string;
    redirectOnClick: (() => void) | null;
    should_show_refresh: boolean;
};

const ErrorComponent: React.FC<Partial<TErrorComponent>> = ({
    header,
    message,
    is_dialog,
    redirect_label,
    redirectOnClick,
    should_show_refresh = true,
}) => {
    const refresh_message: string = should_show_refresh ? localize('Please refresh this page to continue.') : '';

    if (is_dialog) {
        return (
            <Dialog
                title={header || localize('There was an error')}
                is_visible={true}
                confirm_button_text={redirect_label || localize('Ok')}
                onConfirm={redirectOnClick || (() => location.reload())}
            >
                {message || localize('Sorry, an error occurred while processing your request.')}
            </Dialog>
        );
    }
    return (
        <PageErrorContainer
            error_header={header ?? ''}
            error_messages={message ? [message, refresh_message] : []}
            redirect_urls={[routes.trade]}
            redirect_labels={[redirect_label || localize('Refresh')]}
            buttonOnClick={redirectOnClick || (() => location.reload())}
        />
    );
};

export default ErrorComponent;
