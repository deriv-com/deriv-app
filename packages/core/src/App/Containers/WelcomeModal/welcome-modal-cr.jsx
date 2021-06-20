import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'Stores/connect';
import { Dialog, ThemedScrollbars } from '@deriv/components';
import Welcome from './welcome-cr.jsx';

const WelcomeModal = props => {
    const { toggleWelcomeModal, history, toggleShouldShowMultipliersOnboarding } = props;
    const switchPlatform = React.useCallback(
        ({ route, should_show_multiplier } = {}) => {
            toggleWelcomeModal({ is_visible: false, should_persist: true });
            if (route) history.push(route);
            if (should_show_multiplier) toggleShouldShowMultipliersOnboarding(true);
        },
        [toggleWelcomeModal, history, toggleShouldShowMultipliersOnboarding]
    );

    return (
        <Dialog is_visible className='welcome welcome-cr'>
            <ThemedScrollbars height={700}>
                <Welcome switchPlatform={switchPlatform} />
            </ThemedScrollbars>
        </Dialog>
    );
};

export default withRouter(
    connect(({ ui }) => ({
        toggleWelcomeModal: ui.toggleWelcomeModal,
        toggleShouldShowMultipliersOnboarding: ui.toggleShouldShowMultipliersOnboarding,
    }))(WelcomeModal)
);
