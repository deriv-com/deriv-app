import PropTypes      from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect }    from 'Stores/connect';
import routes         from '../../../Constants/routes';

const Redirect = ({
    history,
    setVerificationCode,
    toggleAccountSignupModal,
}) => {
    const url_params  = new URLSearchParams(window.location.search);

    // TODO: Delete this
    // eslint-disable-next-line no-console
    console.log('Reached here');
    switch (url_params.get('action')) {
        case 'signup': {
            toggleAccountSignupModal(true);
            setVerificationCode(url_params.get('code'));
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
    toggleAccountSignupModal: PropTypes.func,
};

export default withRouter(connect(
    ({ client, ui }) => ({
        setVerificationCode     : client.setVerificationCode,
        toggleAccountSignupModal: ui.toggleAccountSignupModal,
    }),
)(Redirect));
