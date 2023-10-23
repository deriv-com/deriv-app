import React from 'react';
import './Divider.scss';

type TProps = {
    horizontal?: boolean;
    margin?: string;
};

const Divider: React.FC<TProps> = ({ horizontal = true, margin }) => (
    <div className={horizontal ? 'wallets-divider__horizontal' : 'wallets-divider__vertical'} style={{ margin }} />
);

export default Divider;
