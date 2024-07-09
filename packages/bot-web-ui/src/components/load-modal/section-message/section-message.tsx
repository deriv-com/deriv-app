import React from 'react';
import { Icon, Text } from '@deriv/components';

type TSectionMessage = {
    icon: string;
    message: string;
    className?: string;
};

const SectionMessage: React.FC<TSectionMessage> = ({ icon, message, className }) => {
    return (
        <div className={className}>
            {icon && (
                <span className='icon'>
                    <Icon icon={icon} />
                </span>
            )}
            <span className='text'>
                <Text size='xs'>{message}</Text>
            </span>
        </div>
    );
};

export default SectionMessage;
