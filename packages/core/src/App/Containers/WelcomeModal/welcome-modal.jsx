import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'Stores/connect';
import { Modal, ThemedScrollbars } from '@deriv/components';
import Welcome from './welcome.jsx';

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
        <Modal width='760px' className='welcome' is_open has_close_icon={false} has_outer_content>
            <ThemedScrollbars height={700}>
                <Welcome switchPlatform={switchPlatform} />
            </ThemedScrollbars>
        </Modal>
    );
};

export default withRouter(
    connect(({ ui }) => ({
        toggleWelcomeModal: ui.toggleWelcomeModal,
        toggleShouldShowMultipliersOnboarding: ui.toggleShouldShowMultipliersOnboarding,
    }))(WelcomeModal)
);
