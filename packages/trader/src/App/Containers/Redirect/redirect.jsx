import PropTypes      from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect }    from 'Stores/connect';
import routes         from '../../../Constants/routes';

const Redirect = ({
    history,
    setCashierActiveTab,
    setVerificationCode,
    toggleAccountSignupModal,
    toggleCashierModal,
}) => {
    const url_params = new URLSearchParams(window.location.search);

    setVerificationCode(url_params.get('code'));

    switch (url_params.get('action')) {
        case 'signup': {
            toggleAccountSignupModal(true);
            break;
        }
        case 'payment_withdraw': {
            setCashierActiveTab('withdraw');
            toggleCashierModal(true);
            break;
        }
        default: break;
    }

    // Clear URL search params and route to root (currently set to `trade`)
    window.history.replaceState({}, document.title, '/');
    history.push(routes.root);

    return null;
};

Redirect.propTypes = {
    history                 : PropTypes.object,
    setVerificationCode     : PropTypes.func,
    toggleAccountSignupModal: PropTypes.func,
    toggleCashierModal      : PropTypes.func,
};

export default withRouter(connect(
    ({ client, ui }) => ({
        setCashierActiveTab     : ui.setCashierActiveTab,
        setVerificationCode     : client.setVerificationCode,
        toggleAccountSignupModal: ui.toggleAccountSignupModal,
        toggleCashierModal      : ui.toggleCashierModal,
    }),
)(Redirect));
