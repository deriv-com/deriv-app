import React, { useEffect } from 'react';
import { Dialog } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { Prompt, withRouter } from 'react-router-dom';

const RoutePromptDialog = ({ condition, history }) => {
    const [should_show, setShow] = React.useState(false);
    const [is_confirmed, setConfirm] = React.useState(false);
    const [last_location, setLastLocation] = React.useState(null);

    useEffect(() => {
        if (is_confirmed && last_location) history.push(last_location.pathname);
    }, [is_confirmed, last_location]);

    const handleBlockedNavigation = next_location => {
        if (!is_confirmed) {
            setLastLocation(next_location);
            setShow(true);
            return false;
        }

        return true;
    };

    const onConfirm = () => {
        setShow(false);
        setConfirm(true);
    };

    const onCancel = () => setShow(false);

    return (
        <>
            <Prompt when={condition} message={handleBlockedNavigation} />
            <Dialog
                title={localize('Are you sure?')}
                confirm_button_text={localize('Yes')}
                cancel_button_text={localize('No')}
                onConfirm={onConfirm}
                onCancel={onCancel}
                is_visible={should_show}
            >
                <Localize i18n_default_text='Navgating to other platform will still complete current bought contract but will stop purchasing a new contract.' />
            </Dialog>
        </>
    );
};

export default withRouter(RoutePromptDialog);
