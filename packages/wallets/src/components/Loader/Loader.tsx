import React from 'react';
import './Loader.scss';

type TProps = {
    color?: React.CSSProperties['color'];
};

const Loader: React.FC<TProps> = ({ color = '#333333' }) => (
    <div className='wallets-loader'>
        <span className='wallets-loader__element' style={{ backgroundColor: color }} />
        <span className='wallets-loader__element' style={{ backgroundColor: color }} />
        <span className='wallets-loader__element' style={{ backgroundColor: color }} />
    </div>
);

export default Loader;
