import React from 'react';
import { DocumentTile } from './components';
import './DocumentsList.scss';

const DocumentsList = () => {
    return (
        <div className='wallets-documents-list'>
            <DocumentTile title='Proof of identity' />
            <DocumentTile title='Proof of address' />
            <DocumentTile title='Personal Details' />
        </div>
    );
};

export default DocumentsList;
