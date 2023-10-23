import React from 'react';
import './Divider.scss';

type TProps = {
    margin?: React.CSSProperties['margin'];
    vertical?: boolean;
};

const Divider: React.FC<TProps> = ({ margin, vertical = false }) => (
    <div className={vertical ? 'wallets-divider__vertical' : 'wallets-divider__horizontal'} style={{ margin }} />
);

export default Divider;
