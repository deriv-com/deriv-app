import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { useAvailableMT5Accounts } from '@deriv/api';
import { MT5PasswordModal } from '../../features/cfd/modals';
import { ModalStepWrapper } from '../Base';
import { useModal } from '../ModalProvider';
import JurisdictionCard from './JurisdictionCard';
import './JurisdictionModal.scss';

const JurisdictionModal = () => {
    const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
    const { modalState, show } = useModal();
    const { data, isLoading } = useAvailableMT5Accounts();

    const marketType = modalState?.marketType || 'all';

    const jurisdictions = useMemo(
        () =>
            data?.filter(account => account.market_type === modalState?.marketType).map(account => account.shortcode) ||
            [],
        [data, modalState?.marketType]
    );

    if (isLoading) return <h1>Loading...</h1>;

    return (
        <ModalStepWrapper
            renderFooter={() => (
                <React.Fragment>
                    <button
                        className={classNames('wallets-jurisdiction-modal__button', {
                            'wallets-jurisdiction-modal__button--disabled': !selectedJurisdiction,
                        })}
                        onClick={() => show(<MT5PasswordModal marketType={marketType} />)}
                    >
                        Next
                    </button>
                </React.Fragment>
            )}
            title='Choose a jurisdiction for your MT5 Derived account'
        >
            <div className='wallets-jurisdiction-modal'>
                <div className='wallets-jurisdiction-modal__cards'>
                    {jurisdictions.map(jurisdiction => (
                        <JurisdictionCard
                            isSelected={selectedJurisdiction === jurisdiction}
                            jurisdiction={jurisdiction || 'bvi'}
                            key={jurisdiction}
                            onSelect={clickedJurisdiction => {
                                if (clickedJurisdiction === selectedJurisdiction) {
                                    setSelectedJurisdiction('');
                                } else {
                                    setSelectedJurisdiction(clickedJurisdiction);
                                }
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
        </ModalStepWrapper>
    );
};

export default JurisdictionModal;
