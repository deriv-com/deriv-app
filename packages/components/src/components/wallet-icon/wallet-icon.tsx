import React from 'react';
import classNames from 'classnames';
import Icon from '../icon';
import './wallet-icon.scss';

type TWalletIconProps = {
    currency: string;
    has_bg?: boolean;
    icon: string;
    size: string;
    type: 'fiat' | 'crypto';
};

const sizes: any = {
    fiat: {
        xsmall: 12,
        small: 16,
        medium: 24,
        large: 32,
        xlarge: 48,
    },
    crypto: {
        xxsmall: {
            width: 26,
            height: 16,
        },
        xsmall: {
            width: 32,
            height: 20,
        },
        small: {
            width: 40,
            height: 24,
        },
        medium: {
            width: 48,
            height: 30,
        },
        large: {
            width: 64,
            height: 40,
        },
        xlarge: {
            width: 80,
            height: 48,
        },
        xxlarge: {
            width: 96,
            height: 60,
        },
    },
};

const WalletIcon = ({ currency, has_bg = false, icon, size = 'medium', type }: TWalletIconProps) => {
    /**
     * The sizes of icons vary when utilizing the wallet-icon with a background, such as a card.
     */
    let icon_size = size;
    if (has_bg) {
        if (size === 'small' && type === 'crypto') icon_size = 'xxsmall';
        if (size === 'medium' && type === 'crypto') icon_size = 'small';
        if (size === 'large') icon_size = 'xlarge';
    }

    if (!icon || !currency) {
        return null;
    }

    return (
        <div className={classNames('wallet-icon', { [`wallet-icon--${size} wallet-card__${currency}-bg`]: !!has_bg })}>
            {type === 'fiat' && <Icon icon={icon} size={sizes[type][icon_size]} />}
            {type === 'crypto' && (
                <Icon icon={icon} width={sizes[type][icon_size].width} height={sizes[type][icon_size].height} />
            )}
        </div>
    );
};

export default WalletIcon;
