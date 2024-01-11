import React from 'react';
import './MobileCloseHeader.scss';

const MobileCloseHeader = () => {
    return (
        <div className='p2p-v2-mobile-close-header'>
            Deriv P2P
            <button className='p2p-v2-mobile-close-header--icon' onClick={() => window.history.back()}>
                X
            </button>
        </div>
    );
};

export default MobileCloseHeader;
