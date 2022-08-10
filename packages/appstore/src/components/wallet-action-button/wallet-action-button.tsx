import * as React from 'react';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/ui';
import { Icon } from '@deriv/components';

interface TProps {
    size: 'small' | 'medium' | 'large';
    icon: string;
    label?: string;
    onClick?: () => void;
    visiblity: string;
}

const WalletActionButton = ({ icon, label, onClick, visiblity, size }: TProps) => {
    return (
        <button className={`wallet-action-button wallet-action-button__${size}`} onClick={onClick}>
            {icon && visiblity && <Icon className='wallet-action-button__icon' icon={icon} />}
            {label && (
                <span>
                    <Text bold={true} type='small' align='center'>
                        {localize(label)}
                    </Text>
                </span>
            )}
        </button>
    );
};

export default WalletActionButton;
