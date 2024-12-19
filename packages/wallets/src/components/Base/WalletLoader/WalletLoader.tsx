import React from 'react';
import classNames from 'classnames';
import './WalletLoader.scss';

type TWalletLoaderProps = {
    className?: string;
    isFullScreen?: boolean;
};

const WalletLoader: React.FC<TWalletLoaderProps> = ({ className, isFullScreen = true }) => {
    return (
        <div
            className={classNames(
                'wallets-initial-loader',
                {
                    'wallets-initial-loader--fullscreen': isFullScreen,
                },
                className
            )}
            data-testid='dt_initial_loader'
        >
            <div className={classNames('wallets-initial-loader__barspinner', 'wallets-barspinner')}>
                {Array.from(new Array(5)).map((_, idx) => (
                    <div
                        className={`wallets-initial-loader__barspinner--rect wallets-barspinner__rect wallets-barspinner__rect--${
                            idx + 1
                        } rect${idx + 1}`}
                        key={idx}
                    />
                ))}
            </div>
        </div>
    );
};

export default WalletLoader;
