import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';

const FormError = ({ error_message }) => {
    const [is_visible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        setIsVisible(!!error_message);
    }, [error_message]);

    const dismissError = () => {
        setIsVisible(false);
    };

    return (
        <Modal is_open={is_visible} small title={localize('Cashier Error')} toggleModal={dismissError}>
            <Modal.Body>{error_message}</Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('OK')} primary onClick={dismissError} />
            </Modal.Footer>
        </Modal>
    );
};

FormError.propTypes = {
    error_message: PropTypes.string,
};

export default FormError;
