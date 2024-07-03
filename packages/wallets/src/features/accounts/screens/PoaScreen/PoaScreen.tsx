import React from 'react';
import { AddressSection } from '../AddressSection';
import { DocumentSubmission } from '../DocumentSubmission';
import './PoaScreen.scss';

const PoaScreen: React.FC = () => (
    <div className='wallets-poa'>
        <AddressSection />
        <DocumentSubmission />
    </div>
);

export default PoaScreen;
