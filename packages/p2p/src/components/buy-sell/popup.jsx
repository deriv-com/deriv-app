import React from 'react';
import PropTypes from 'prop-types';
import Dp2pContext from 'Components/context/dp2p-context';
import BuySellForm from './buy-sell-form.jsx';
import NicknameForm from '../nickname/nickname-form.jsx';

const Popup = ({ ad, handleClose, handleConfirm }) => {
    const { nickname } = React.useContext(Dp2pContext);

    return (
        <div className='buy-sell__popup'>
            {nickname ? (
                <BuySellForm ad={ad} handleClose={handleClose} handleConfirm={handleConfirm} />
            ) : (
                <NicknameForm ad={ad} handleClose={handleClose} />
            )}
        </div>
    );
};

Popup.propTypes = {
    ad: PropTypes.object,
    handleClose: PropTypes.func,
    handleConfirm: PropTypes.func,
};

export default Popup;
