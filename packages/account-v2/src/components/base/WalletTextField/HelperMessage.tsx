import React, { InputHTMLAttributes, memo } from 'react';
import WalletText, { WalletTextProps } from '../WalletText/WalletText';

export type HelperMessageProps = {
    inputValue?: InputHTMLAttributes<HTMLInputElement>['value'];
    isError?: boolean;
    maxLength?: InputHTMLAttributes<HTMLInputElement>['maxLength'];
    message?: string;
    messageVariant?: 'error' | 'general' | 'warning';
};

const HelperMessage: React.FC<HelperMessageProps> = memo(
    ({ inputValue, isError, maxLength, message, messageVariant = 'general' }) => {
        const HelperMessageColors: Record<string, WalletTextProps['color']> = {
            error: 'error',
            general: 'less-prominent',
            warning: 'warning',
        };

        return (
            <React.Fragment>
                {message && (
                    <div className='wallets-textfield__message-container--msg'>
                        <WalletText
                            color={isError ? HelperMessageColors.error : HelperMessageColors[messageVariant]}
                            size='xs'
                        >
                            {message}
                        </WalletText>
                    </div>
                )}
                {maxLength && (
                    <div className='wallets-textfield__message-container--maxchar'>
                        <WalletText align='right' color='less-prominent' size='xs'>
                            {inputValue?.toString().length || 0} / {maxLength}
                        </WalletText>
                    </div>
                )}
            </React.Fragment>
        );
    }
);

HelperMessage.displayName = 'HelperMessage';
export default HelperMessage;
