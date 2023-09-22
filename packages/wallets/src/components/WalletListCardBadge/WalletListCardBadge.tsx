import React from 'react';
import './WalletListCardBadge.scss';

type TProps = {
    is_demo?: boolean;
    label: string;
};

const WalletListCardBadge: React.FC<TProps> = ({ is_demo, label }) => {
    const className = is_demo ? 'wallets-list-card__badge--demo' : 'wallets-list-card__badge';

    const labelStyle: React.CSSProperties = {
        color: is_demo ? 'white' : 'black',
    };

    return (
        <div className={className}>
            <div className='wallets-list-card__name'>
                <p style={labelStyle}>{label}</p>
            </div>
        </div>
    );
};

export default WalletListCardBadge;
