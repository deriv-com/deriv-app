import React from 'react';
import CrossIcon from '../../public/ic-cross.svg';
import './MobileCloseHeader.scss';

const MobileCloseHeader = () => {
    return (
        <div className='p2p-v2-mobile-close-header'>
            Deriv P2P
            <CrossIcon className='p2p-v2-mobile-close-header--icon' onClick={() => window.history.back()} />
        </div>
    );
};

export default MobileCloseHeader;
