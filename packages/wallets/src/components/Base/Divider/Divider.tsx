import React from 'react';
import './Divider.scss';

type TProps = {
    color?: React.CSSProperties['color'];
    margin?: React.CSSProperties['margin'];
    variant?: 'horizontal' | 'vertical';
};

const Divider: React.FC<TProps> = ({ color, margin, variant = 'horizontal' }) => (
    <div className={`wallets-divider__${variant}`} style={{ color, margin }} />
);

export default Divider;
