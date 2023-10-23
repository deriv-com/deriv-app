import React from 'react';
import './Divider.scss';

type TProps = {
    margin?: React.CSSProperties['margin'];
    variant?: 'horizontal' | 'vertical';
};

const Divider: React.FC<TProps> = ({ margin, variant = 'horizontal' }) => (
    <div className={`wallets-divider__${variant}`} style={{ margin }} />
);

export default Divider;
