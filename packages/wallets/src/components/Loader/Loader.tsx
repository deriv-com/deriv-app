import React from 'react';
import classNames from 'classnames';
import './Loader.scss';

type TProps = {
    color?: React.CSSProperties['color'];
    isFullScreen?: boolean;
};

const Loader: React.FC<TProps> = ({ color = '#85ACB0', isFullScreen = true }) => (
    <div className={classNames('wallets-loader', { 'wallets-loader--fullscreen': isFullScreen })}>
        <span className='wallets-loader__element' style={{ backgroundColor: color }} />
        <span className='wallets-loader__element' style={{ backgroundColor: color }} />
        <span className='wallets-loader__element' style={{ backgroundColor: color }} />
        <span className='wallets-loader__element' style={{ backgroundColor: color }} />
        <span className='wallets-loader__element' style={{ backgroundColor: color }} />
    </div>
);

export default Loader;
