import React from 'react';
import { WalletButton, WalletText } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import './PasswordLimitExceeded.scss';

type TProps = {
    onPrimaryClick: () => void;
    onSecondaryClick: () => void;
};

const PasswordLimitExceeded: React.FC<TProps> = ({ onPrimaryClick, onSecondaryClick }) => {
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';
    return (
        <div className='wallets-password-limit-exceeded'>
            <WalletText align='start' weight='bold'>
                Too many attempts
            </WalletText>
            <WalletText size='sm'>Please try again in a minute.</WalletText>
            <div className='wallets-password-limit-exceeded__buttons'>
                <WalletButton
                    borderWidth='md'
                    onClick={onSecondaryClick}
                    size='lg'
                    textSize={textSize}
                    variant='outlined'
                >
                    Forgot password?
                </WalletButton>
                <WalletButton onClick={onPrimaryClick} size='lg' textSize={textSize}>
                    Try later
                </WalletButton>
            </div>
        </div>
    );
};

export default PasswordLimitExceeded;
