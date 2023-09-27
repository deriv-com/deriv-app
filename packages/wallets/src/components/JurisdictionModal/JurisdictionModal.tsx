import React from 'react';
import classNames from 'classnames';
import { PrimaryActionButton } from '../PrimaryActionButton';
import { WalletModal } from '../WalletModal';
import { WideWrapper } from '../WideWrapper';
import JurisdictionCard from './JurisdictionCard';
import './JurisdictionModal.scss';

const JurisdictionModal = () => {
    const [selectedJurisdiction, setSelectedJurisdiction] = useState('');

    const jurisdictions = ['St. Vincent & Grenadines', 'British Virgin Islands', 'Vanuatu'];

    return (
        <WalletModal>
            <WideWrapper
                renderFooter={() => (
                    <React.Fragment>
                        <PrimaryActionButton
                            className={classNames('wallets-jurisdiction-modal__button', {
                                'wallets-jurisdiction-modal__button--disabled': !selectedJurisdiction,
                            })}
                        >
                            Next
                        </PrimaryActionButton>
                    </React.Fragment>
                )}
                renderHeader={() => <div>Choose a jurisdiction for your MT5 Derived account</div>}
            >
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
            </WideWrapper>
        </WalletModal>
    );
};

export default JurisdictionModal;
