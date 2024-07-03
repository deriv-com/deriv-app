import React from 'react';
import { AddressSection } from '../AddressSection';
import { DocumentSubmission } from '../DocumentSubmission';
import { IDVDocumentUpload } from '../IDVDocumentUpload';
import { PersonalDetails } from '../PersonalDetails';
import './PoaScreen.scss';

const PoaScreen: React.FC = () => (
    <div className='wallets-poa'>
        <PersonalDetails />
        <IDVDocumentUpload />
        <AddressSection />
        <DocumentSubmission />
    </div>
);

export default PoaScreen;
