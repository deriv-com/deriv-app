import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'Stores/connect';
import { Modal, ThemedScrollbars } from '@deriv/components';
import Welcome from './welcome.jsx';

const WelcomeModal = props => {
    const {
        country_standpoint,
        is_eu,
        can_have_mf_account,
        can_have_mlt_account,
        toggleWelcomeModal,
        history,
        toggleShouldShowMultipliersOnboarding,
    } = props;
    const switchPlatform = React.useCallback(
        ({ route, should_show_multiplier } = {}) => {
            toggleWelcomeModal({ is_visible: false, should_persist: true });
            if (route) history.push(route);
            if (should_show_multiplier) toggleShouldShowMultipliersOnboarding(true);
        },
        [toggleWelcomeModal, history, toggleShouldShowMultipliersOnboarding]
    );

    return (
        <Modal width='760px' className='welcome welcome-cr' is_open has_close_icon={false} has_outer_content>
            <ThemedScrollbars height={700}>
                <Welcome
                    country_standpoint={country_standpoint}
                    is_eu={is_eu}
                    switchPlatform={switchPlatform}
                    can_have_mf_account={can_have_mf_account}
                    can_have_mlt_account={can_have_mlt_account}
                />
            </ThemedScrollbars>
        </Modal>
    );
};

export default withRouter(
    connect(({ client, ui }) => ({
        country_standpoint: client.country_standpoint,
        is_eu: client.is_eu,
        can_have_mf_account: client.can_have_mf_account,
        can_have_mlt_account: client.can_have_mlt_account,
        toggleWelcomeModal: ui.toggleWelcomeModal,
        toggleShouldShowMultipliersOnboarding: ui.toggleShouldShowMultipliersOnboarding,
    }))(WelcomeModal)
);
