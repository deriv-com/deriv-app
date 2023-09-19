import React from 'react';
import './WalletListCardBadge.scss';

type TProps = {
    label: string;
    is_demo?: boolean;
};

const WalletListCardBadge: React.FC<TProps> = ({ label, is_demo }) => {
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
