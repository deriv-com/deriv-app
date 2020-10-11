import React from 'react';
import PropTypes from 'prop-types';
import Dp2pContext from 'Components/context/dp2p-context';
import BuySellForm from './buy-sell-form.jsx';
import NicknameForm from '../nickname/nickname-form.jsx';

const Popup = ({ advert, handleClose, handleConfirm }) => {
    const { nickname } = React.useContext(Dp2pContext);

    return (
        <div className='buy-sell__popup'>
            {nickname ? (
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
