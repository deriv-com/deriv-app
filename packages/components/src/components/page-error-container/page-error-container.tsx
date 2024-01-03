import React from 'react';
import PageError from '../page-error';
import UnhandledErrorModal from '../unhandled-error-modal';
import ErrorModal from '../error-modal';

type TPageErrorContainer = {
    buttonOnClick?: () => void;
    error_header?: React.ReactNode;
    error_messages?: Array<{ message: string; has_html?: boolean } | React.ReactNode>;
    redirect_labels: string[];
    redirect_urls?: string[];
    setError?: (has_error: boolean, error: React.ReactNode) => void;
    should_clear_error_on_click?: boolean;
};

const PageErrorContainer = ({ error_header, error_messages, ...props }: TPageErrorContainer) => {
    if (error_header && error_messages) {
        return <PageError header={error_header} messages={error_messages} {...props} />;
    }
    // If there are error messages from the backend, show an error modal with the messages
    if (error_messages) {
        return <ErrorModal messages={error_messages} />;
    }
    return <UnhandledErrorModal />;
};

export default PageErrorContainer;
