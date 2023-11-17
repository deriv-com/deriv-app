import React, { InputHTMLAttributes } from 'react';
import WalletText from '../WalletText/WalletText';

export type HelperMessageProps = {
    inputValue?: InputHTMLAttributes<HTMLInputElement>['value'];
    isError?: boolean;
    maxLength?: InputHTMLAttributes<HTMLInputElement>['maxLength'];
    message?: string;
};

const HelperMessage: React.FC<HelperMessageProps> = ({ inputValue, isError, maxLength, message }) => (
    <React.Fragment>
        {message && (
            <div className='wallets-textfield__message-container--msg'>
                <WalletText color={isError ? 'error' : 'less-prominent'} size='xs'>
                    {message}
                </WalletText>
            </div>
        )}
        {maxLength && (
            <div className='wallets-textfield__message-container--maxchar'>
                <WalletText align='right' color='less-prominent' size='xs'>
                    {inputValue?.toString().length} / {maxLength}
                </WalletText>
            </div>
        )}
    </React.Fragment>
);

export default HelperMessage;
