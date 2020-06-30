import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Modal } from '@deriv/components';
import routes from '@deriv/shared/utils/routes';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const RealityCheckModal = withRouter(
    ({ disableApp, enableApp, history, is_visible, setReportsTabIndex, toggleRealityCheck }) => {
        const openStatement = () => {
            // index of statement in reports' side menu is 2
            setReportsTabIndex(2);
            history.push(routes.statement);
            toggleRealityCheck();
        };

        return (
            <Modal
                enableApp={enableApp}
                is_open={is_visible}
                disableApp={disableApp}
                title={localize('Trading statistics report')}
                width='720px'
            >
                <Modal.Body>
                    <Localize i18n_default_text='Options trading can become a real addiction, as can any other activity pushed to its limits. To avoid the danger of such an addiction, we provide a reality-check that gives you a summary of your traders and accounts on a regular basis.' />
                    <br />
                    <Localize
                        i18n_default_text='Would like to check your statement first? <0>Check Statement</0>'
                        components={[<a key={0} className='link' onClick={openStatement} />]}
                    />
                </Modal.Body>
            </Modal>
        );
    }
);

RealityCheckModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    history: PropTypes.object,
    is_visible: PropTypes.bool,
    setReportsTabIndex: PropTypes.func,
    toggleRealityCheck: PropTypes.func,
};

export default connect(({ client, ui }) => ({
    is_visible: client.is_reality_check_visible,
    toggleRealityCheck: client.toggleRealityCheck,
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
    setReportsTabIndex: ui.setReportsTabIndex,
}))(RealityCheckModal);
