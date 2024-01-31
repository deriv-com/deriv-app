import React from 'react';
import './ProgressBar.scss';

type TProps = {
    activeIndex: number;
    count: number;
    onClick?: (index: number) => void;
};

const ProgressBar: React.FC<TProps> = ({ activeIndex, count, onClick }) => {
    return (
        <div className='wallets-progress-bar' role='progressbar'>
            {[...Array(count).keys()].map(idx => {
                const isActive = idx === activeIndex;
                const barClassname = isActive ? 'wallets-progress-bar-active' : 'wallets-progress-bar-inactive';

                return (
                    <div
                        className={`${barClassname} wallets-progress-bar-transition`}
                        key={`progress-bar-${idx}`}
                        onClick={() => onClick?.(idx)}
                    />
                );
            })}
        </div>
    );
};

export default ProgressBar;
