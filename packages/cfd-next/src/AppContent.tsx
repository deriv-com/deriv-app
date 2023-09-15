import React from 'react';
import ModalManager from 'Containers/modal-manager/ModalManager';
import './app-content.scss';

const AppContent: React.FC = () => {
    return (
        <div>
            <div className='wallet-app-content-icon' />
            <ModalManager />
        </div>
    );
};

export default AppContent;
