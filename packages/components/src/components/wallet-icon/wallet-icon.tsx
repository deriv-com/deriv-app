import React from 'react';
import classNames from 'classnames';
import Icon from '../icon';
import './wallet-icon.scss';

type TWalletIconSizes = keyof typeof sizes['square' | 'box'];

type TWalletIconProps = {
    gradient_for?: string;
    icon: string;
    size?: TWalletIconSizes;
    type?: 'demo' | 'fiat' | 'crypto' | 'app';
    has_bg?: boolean;
    is_demo?: boolean;
    is_dark?: boolean;
    hide_watermark?: boolean;
};

const sizes = {
    square: {
        xsmall: 12,
        small: 16,
        medium: 24,
        large: 32,
        xlarge: 48,
    },
    // The crypto and demo sizes are the same
    box: {
        xsmall: {
            width: 20,
            height: 12,
        },
        small: {
            width: 32,
            height: 20,
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
            width: 96,
            height: 60,
        },
    },
} as const;

const WalletIcon = ({
    gradient_for,
    icon,
    size = 'medium',
    type,
    has_bg,
    is_dark,
    hide_watermark,
}: TWalletIconProps) => {
    if (!icon) {
        return null;
    }

    return (
        <div
            className={classNames('wallet-icon', {
                [`wallet-icon--${size} wallet-icon__default-bg wallet-card__${gradient_for}-bg${
                    is_dark ? '--dark' : ''
                }`]: (!!gradient_for && type !== 'app') || has_bg,
                'wallet-card--hide-watermark': hide_watermark,
            })}
        >
            {(type === 'fiat' || type === 'app') && <Icon icon={icon} size={sizes.square[size]} />}
            {(type === 'demo' || type === 'crypto') && (
                <Icon icon={icon} width={sizes.box[size].width} height={sizes.box[size].height} />
            )}
        </div>
    );
};

export default WalletIcon;
