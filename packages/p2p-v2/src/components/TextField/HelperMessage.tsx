import React, { InputHTMLAttributes, memo } from 'react';
import { Text, TextProps } from '@deriv-com/ui/dist/components/Text';

export type HelperMessageProps = {
    inputValue?: InputHTMLAttributes<HTMLInputElement>['value'];
    isError?: boolean;
    maxLength?: InputHTMLAttributes<HTMLInputElement>['maxLength'];
    message?: string;
    messageVariant?: 'error' | 'general' | 'warning';
};

const HelperMessage: React.FC<HelperMessageProps> = memo(
    ({ inputValue, isError, maxLength, message, messageVariant = 'general' }) => {
        const HelperMessageColors: Record<string, TextProps['color']> = {
            error: 'error',
            general: 'less-prominent',
            warning: 'warning',
        };

        return (
            <React.Fragment>
                {message && (
                    <div className='p2p-v2-textfield__message-container--msg'>
                        <Text
                            color={isError ? HelperMessageColors.error : HelperMessageColors[messageVariant]}
                            size='xs'
                        >
                            {message}
                        </Text>
                    </div>
                )}
                {maxLength && (
                    <div className='p2p-v2-textfield__message-container--maxchar'>
                        <Text align='right' color='less-prominent' size='xs'>
                            {inputValue?.toString().length || 0} / {maxLength}
                        </Text>
                    </div>
                )}
            </React.Fragment>
        );
    }
);

HelperMessage.displayName = 'HelperMessage';
export default HelperMessage;
