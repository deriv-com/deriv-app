import React, { useState } from 'react';
import classNames from 'classnames';
import { useAvailableMT5Accounts } from '@deriv/api';
import { ModalStepWrapper } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import { JurisdictionScreen } from '../../screens/JurisdictionScreen';
import { MT5PasswordModal } from '..';

const JurisdictionModal = () => {
    const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
    const { modalState, show } = useModal();
    const { isLoading } = useAvailableMT5Accounts();

    const marketType = modalState?.marketType || 'all';

    if (isLoading) return <h1>Loading...</h1>;

    return (
        <ModalStepWrapper
            renderFooter={() => (
                <React.Fragment>
                    <button
                        className={classNames('wallets-jurisdiction-screen__button', {
                            'wallets-jurisdiction-screen__button--disabled': !selectedJurisdiction,
                        })}
                        onClick={() => show(<MT5PasswordModal marketType={marketType} />)}
                    >
                        Next
                    </button>
                </React.Fragment>
            )}
            title='Choose a jurisdiction for your MT5 Derived account'
        >
            <JurisdictionScreen
                selectedJurisdiction={selectedJurisdiction}
                setSelectedJurisdiction={setSelectedJurisdiction}
            />
        </ModalStepWrapper>
    );
};

export default JurisdictionModal;
