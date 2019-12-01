import PropTypes     from 'prop-types';
import React         from 'react';
import PageError     from 'Modules/PageError';
import { routes }    from 'Constants/index';
import { Localize }  from 'deriv-translations';

const ErrorComponent = ({
    header,
    message,
    redirect_label,
    redirectOnClick,
    should_show_refresh = true,
}) => {
    const refresh_message = should_show_refresh ? <Localize i18n_default_text='Please refresh this page to continue.' /> : '';

    return (
        <PageError
            header={header || <Localize i18n_default_text='Oops, something went wrong.' />}
            messages={
                message
                    ? [
                        message,
                        refresh_message,
                    ]
                    : [
                        <Localize key={0} i18n_default_text='Sorry, an error occured while processing your request.' />,
                        refresh_message,
                    ]}
            redirect_url={routes.trade}
            redirect_label={redirect_label || <Localize i18n_default_text='Refresh' />}
            buttonOnClick={redirectOnClick || (() => location.reload())}
        />
    );
};

ErrorComponent.propTypes = {
    message: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
        PropTypes.object,
    ]),
    type: PropTypes.string,
};

export default ErrorComponent;
