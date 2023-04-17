import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { PageError } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { CloseMxMltAccountContent } from 'App/Containers/CloseMxMltAccountModal/close-mx-mlt-account-modal.jsx';
import { observer, useStore } from '@deriv/stores';

const ErrorComponent = observer(
    ({
        header,
        message,
        redirect_label,
        redirectOnClick,
        should_clear_error_on_click,
        setError,
        showNotificationMessageByKey,
        type,
        redirect_to = routes.trade,
        should_show_refresh = true,
    }) => {
        const history = useHistory();
        const { client, notifications, ui } = useStore();
        const { removeNotificationMessageByKey } = notifications;
        const { has_malta_account, can_have_mlt_account, country_standpoint } = client;
        const { showCloseMxMltAccountPopup } = ui;
        React.useEffect(() => {
            if (!history) return undefined;
            return history.listen(() => {
                if (typeof setError === 'function') {
                    setError(false, null);
                }
            });
        }, [history, setError]);

        const refresh_message = should_show_refresh ? localize('Please refresh this page to continue.') : '';
        const hide_notification = localStorage.getItem('hide_close_mx_mlt_account_notification');

        if (type === 'mx_mlt_removal' && !hide_notification) {
            return (
                <div className='close-mx-mlt-account close-mx-mlt-account--is-fullscreen'>
                    <CloseMxMltAccountContent
                        can_have_mlt_account={can_have_mlt_account}
                        country_standpoint={country_standpoint}
                        has_malta_account={has_malta_account}
                        is_fullscreen={true}
                        showNotificationMessageByKey={showNotificationMessageByKey}
                        showCloseMxMltAccountPopup={showCloseMxMltAccountPopup}
                        removeNotificationMessageByKey={removeNotificationMessageByKey}
                    />
                </div>
            );
        }

        if (localStorage.getItem('hide_close_mx_mlt_account_notification')) {
            return (
                <PageError
                    header={header || localize('Something’s not right')}
                    messages={message ? [message, refresh_message] : []}
                    redirect_urls={[]}
                    redirect_labels={[]}
                    buttonOnClick={() => ({})}
                    should_clear_error_on_click={false}
                    setError={setError}
                />
            );
        }
        return (
            <PageError
                header={header || localize('Something’s not right')}
                messages={
                    message
                        ? [message, refresh_message]
                        : [localize('Sorry, an error occured while processing your request.'), refresh_message]
                }
                redirect_urls={[redirect_to]}
                redirect_labels={[redirect_label || localize('Refresh')]}
                buttonOnClick={redirectOnClick || (() => location.reload())}
                should_clear_error_on_click={should_clear_error_on_click}
                setError={setError}
                has_malta_account={has_malta_account}
            />
        );
    }
);

ErrorComponent.propTypes = {
    header: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    redirectOnClick: PropTypes.func,
    redirect_label: PropTypes.string,
    setError: PropTypes.func,
    should_clear_error_on_click: PropTypes.bool,
    showNotificationMessageByKey: PropTypes.func,
    redirect_to: PropTypes.string,
    should_show_refresh: PropTypes.bool,
    type: PropTypes.string,
};

export default ErrorComponent;
