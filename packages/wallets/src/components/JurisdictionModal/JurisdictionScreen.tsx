import React, { useState } from 'react';
import classNames from 'classnames';
import { useModal } from '../ModalProvider';
import { ModalStepWrapper } from '../ModalStepWrapper';
import { MT5PasswordModal } from '../MT5PasswordModal';
import JurisdictionCard from './JurisdictionCard';
import './JurisdictionModal.scss';

const JurisdictionScreen = () => {
    const [selectedJurisdiction, setSelectedJurisdiction] = useState('');

    const jurisdictions = ['St. Vincent & Grenadines', 'British Virgin Islands', 'Vanuatu'];

    return (
        <div className='wallets-jurisdiction-modal'>
            <div className='wallets-jurisdiction-modal__cards'>
                {jurisdictions.map(jurisdiction => (
                    <JurisdictionCard
                        isSelected={selectedJurisdiction === jurisdiction}
                        jurisdiction={jurisdiction}
                        key={jurisdiction}
                        onSelect={clickedJurisdiction => {
                            setSelectedJurisdiction(clickedJurisdiction);
                        }}
                        tag='Straight-through processing'
                    />
                ))}
            </div>

            {selectedJurisdiction && (
                <div className='wallets-jurisdiction-modal__tnc'>
                    Add Your Deriv MT5 Financial account under Deriv (V) Ltd, regulated by the Vanuatu Financial
                    Services Commission.
                    <div className='wallets-jurisdiction-modal__tnc-checkbox'>
                        <input type='checkbox' />
                        <label>I confirm and accept Deriv (V) Ltd’s Terms and Conditions</label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JurisdictionScreen;
