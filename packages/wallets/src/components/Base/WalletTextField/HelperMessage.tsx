import React, { InputHTMLAttributes } from 'react';
import WalletText from '../WalletText/WalletText';

export type MessageContainerProps = {
    helperMessage?: string;
    inputValue?: InputHTMLAttributes<HTMLInputElement>['value'];
    maxLength?: InputHTMLAttributes<HTMLInputElement>['maxLength'];
};

const MessageContainer: React.FC<MessageContainerProps> = ({ helperMessage, inputValue, maxLength }) => (
    <React.Fragment>
        {helperMessage && (
            <div className='wallets-textfield__message-container--msg'>
                <WalletText color='less-prominent' size='xs'>
                    {helperMessage}
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

export default MessageContainer;
