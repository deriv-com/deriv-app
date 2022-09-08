import * as React from 'react';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/ui';
import { Icon } from '@deriv/components';

type TWalletActionButtonProps = {
    size: 'small' | 'medium' | 'large';
    icon: string;
    label?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const WalletActionButton = ({ icon, label, onClick, size }: TWalletActionButtonProps) => {
    return (
        <button className={`wallet-action-button wallet-action-button__${size}`} onClick={onClick}>
            {icon && <Icon className='wallet-action-button__icon' icon={icon} />}
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
