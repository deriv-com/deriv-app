import React from 'react';
import { WalletIcon } from '../wallet-icon';
import './app-linked-with-wallet-icon.scss';

type TAppIconProps = {
    app_icon: string;
    gradient_class: string;
    has_bg?: boolean;
    hide_watermark?: boolean;
    size?: 'small' | 'medium' | 'large';
    type: React.ComponentProps<typeof WalletIcon>['type'];
    wallet_icon: string;
};

/**
 * Use the WalletIcon sizes
 */
const sizes = {
    top: {
        small: 'small',
        medium: 'medium',
        large: 'xlarge',
    },
    bottom: {
        small: 'xsmall',
        medium: 'small',
        large: 'large',
    },
} as const;

const AppLinkedWithWalletIcon = ({
    app_icon,
    gradient_class,
    hide_watermark,
    size = 'medium',
    type,
    wallet_icon,
}: TAppIconProps) => {
    if (!app_icon || !wallet_icon || !gradient_class) {
        return null;
    }

    return (
        <div className={`app-icon app-icon--${size}`}>
            {/* Top Icon */}
            <div className='app-icon__top-icon'>
                <WalletIcon icon={app_icon} size={sizes.top[size]} type='app' />
            </div>

            {/* Bottom Icon */}
            <div className='app-icon__bottom-icon'>
                <WalletIcon
                    icon={wallet_icon}
                    gradient_class={gradient_class}
                    type={type}
                    size={sizes.bottom[size]}
                    has_bg
                    hide_watermark={hide_watermark}
                />
            </div>
        </div>
    );
};

export default AppLinkedWithWalletIcon;
