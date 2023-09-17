import React from 'react';
import ModalManager from './containers/modal-manager/modal-managers';
import './app-content.scss';

const AppContent: React.FC = () => {
    return (
        <div className='cfd-app'>
            <ModalManager />
        </div>
    );
};

export default AppContent;
