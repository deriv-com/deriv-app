import React from 'react';
import ModalManager from 'Containers/modal-manager/ModalManager';
import './app-content.scss';

const AppContent: React.FC = () => {
    return (
        <div>
            <div className='cfd-app' />
            <ModalManager />
        </div>
    );
};

export default AppContent;
