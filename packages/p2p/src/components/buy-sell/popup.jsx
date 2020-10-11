import React from 'react';
import PropTypes from 'prop-types';
import { useStores } from 'Stores';
import BuySellForm from './buy-sell-form.jsx';
import NicknameForm from '../nickname/nickname-form.jsx';

const Popup = ({ advert, handleClose, handleConfirm }) => {
    const { general_store } = useStores();

    return (
        <div className='buy-sell__popup'>
            {general_store.nickname ? (
                <BuySellForm advert={advert} handleClose={handleClose} handleConfirm={handleConfirm} />
            ) : (
                <NicknameForm advert={advert} handleClose={handleClose} />
            )}
        </div>
    );
};

Popup.propTypes = {
    advert: PropTypes.object,
    handleClose: PropTypes.func,
    handleConfirm: PropTypes.func,
};

export default Popup;
