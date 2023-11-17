import React, { InputHTMLAttributes } from 'react';
import WalletText from '../WalletText/WalletText';

export type HelperMessageProps = {
    inputValue?: InputHTMLAttributes<HTMLInputElement>['value'];
    maxLength?: InputHTMLAttributes<HTMLInputElement>['maxLength'];
    message?: string;
};

const HelperMessage: React.FC<HelperMessageProps> = ({ inputValue, maxLength, message }) => (
    <React.Fragment>
        {message && (
            <div className='wallets-textfield__message-container--msg'>
                <WalletText color='less-prominent' size='xs'>
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
