import React from 'react';
import PropTypes from 'prop-types';
import Dp2pContext from 'Components/context/dp2p-context';
import BuySellForm from './buy-sell-form.jsx';
import NicknameForm from './nickname-form.jsx';

const Popup = ({ ad, handleClose, handleConfirm }) => {
    const { nickname, setNickname, setChatInfo } = React.useContext(Dp2pContext);

    return (
        <div className='buy-sell__popup'>
            {nickname ? (
                <BuySellForm ad={ad} handleClose={handleClose} handleConfirm={handleConfirm} />
            ) : (
                <NicknameForm ad={ad} handleClose={handleClose} setNickname={setNickname} setChatInfo={setChatInfo} />
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
