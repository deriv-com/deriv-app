import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { PageError, PageErrorContainer } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { CloseMxMltAccountContent } from 'App/Containers/CloseMxMltAccountModal/close-mx-mlt-account-modal.jsx';

const ErrorComponent = ({
    can_have_mlt_account,
    country_standpoint,
    has_malta_account,
    header,
    message,
    redirect_label,
    redirectOnClick = null,
    should_clear_error_on_click,
    setError,
    showNotificationMessageByKey,
    showCloseMxMltAccountPopup,
    removeNotificationMessageByKey,
    type,
    redirect_to = routes.trade,
    should_show_refresh = true,
    should_redirect = true,
}) => {
    const history = useHistory();

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
        <PageErrorContainer
            error_header={header ?? ''}
            error_messages={message ? [message, refresh_message] : []}
            redirect_urls={[redirect_to]}
            redirect_labels={(redirect_label === false && []) || [redirect_label || localize('Refresh')]}
            buttonOnClick={redirectOnClick || (() => location.reload())}
            should_clear_error_on_click={should_clear_error_on_click}
            setError={setError}
            has_malta_account={has_malta_account}
            should_redirect={should_redirect}
        />
    );
};

ErrorComponent.propTypes = {
    can_have_mlt_account: PropTypes.bool,
    country_standpoint: PropTypes.object,
    has_malta_account: PropTypes.bool,
    header: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    redirectOnClick: PropTypes.func || PropTypes.object,
    redirect_label: PropTypes.string,
    setError: PropTypes.func,
    should_clear_error_on_click: PropTypes.bool,
    should_redirect: PropTypes.bool,
    showNotificationMessageByKey: PropTypes.func,
    showCloseMxMltAccountPopup: PropTypes.func,
    removeNotificationMessageByKey: PropTypes.func,
    redirect_to: PropTypes.string,
    should_show_refresh: PropTypes.bool,
    type: PropTypes.string,
};

export default connect(({ client, notifications, ui }) => ({
    removeNotificationMessageByKey: notifications.removeNotificationMessageByKey,
    showCloseMxMltAccountPopup: ui.showCloseMxMltAccountPopup,
    has_malta_account: client.has_malta_account,
    can_have_mlt_account: client.can_have_mlt_account,
    country_standpoint: client.country_standpoint,
}))(ErrorComponent);
