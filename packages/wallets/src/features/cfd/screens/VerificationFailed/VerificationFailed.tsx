import React from 'react';
import { WalletButton, WalletText } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import './VerificationFailed.scss';

const VerificationFailed = () => {
    const { hide } = useModal();
    return (
        <div className='wallets-verification-failed'>
            <WalletText size='sm' weight='bold'>
                Why did my verification fail?
            </WalletText>
            <WalletText size='sm'>
                Your [dynamic document] did not pass our verification checks. This could be due to reasons such as:
            </WalletText>
            <ul>
                <li>
                    <WalletText size='sm'>Document details do not match profile details</WalletText>
                </li>
                <li>
                    <WalletText size='sm'>Expired documents</WalletText>
                </li>
                <li>
                    <WalletText size='sm'>Poor image quality</WalletText>
                </li>
            </ul>
            <WalletText size='sm'>
                Click <strong>Resubmit documents</strong> to find out more and submit your documents again.
            </WalletText>
            <div className='wallets-verification-failed__footer'>
                <WalletButton onClick={() => hide()} size='lg' text='Maybe later' variant='outlined' />
                <WalletButton size='lg' text='Resubmit documents' />
            </div>
        </div>
    );
};

export default VerificationFailed;
