import React from 'react';
import './WalletListCardBadge.scss';

type TProps = {
    isDemo?: boolean;
    label?: string;
};

const WalletListCardBadge: React.FC<TProps> = ({ isDemo, label }) => {
    const className = isDemo ? 'wallets-list-card__badge--demo' : 'wallets-list-card__badge';

    const labelStyle: React.CSSProperties = {
        color: isDemo ? 'white' : 'black',
    };

    const formattedLabel = label === 'virtual' ? 'Demo' : label?.toUpperCase() || 'SVG';

    return (
        <div className={className}>
            <div className='wallets-list-card__name'>
                <p style={labelStyle}>{formattedLabel}</p>
            </div>
        </div>
    );
};

export default WalletListCardBadge;
