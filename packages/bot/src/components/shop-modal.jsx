import PropTypes        from 'prop-types';
import React            from 'react';
import { Modal }        from 'deriv-components';
import { localize }     from 'deriv-translations/lib/i18n';
import Shop             from './shop.jsx';
import { connect }      from '../stores/connect';

const ShopModal = ({
    is_open,
    toggleShopModal,
}) => {
    return (
        <Modal
            title={localize('Shop')}
            className='shop__modal'
            is_open={is_open}
            toggleModal={() => toggleShopModal()}
            height={'100vh'}
            width={'100vw'}
        >
            <Shop />
        </Modal>
    );
};

ShopModal.propTypes = {
    is_open        : PropTypes.bool,
    toggleShopModal: PropTypes.func,
};

export default connect(({ shop }) => ({
    toggleShopModal: shop.toggleShopModal,
    is_open        : shop.is_open,
}))(ShopModal);
