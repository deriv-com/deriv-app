import React from 'react';
import './ProgressBar.scss';

type TProps = {
    activeIndex: number;
    indexes: string[];
    isTransition?: boolean;
    setActiveIndex: (index: string) => void;
};

const ProgressBar: React.FC<TProps> = ({ activeIndex, indexes, isTransition = true, setActiveIndex }) => {
    return (
        <div className='wallets-progress-bar'>
            {indexes.map((value, idx) => {
                const currentIndex = idx + 1;
                const isActive = currentIndex === activeIndex;

                const barClassname = isActive ? 'wallets-progress-bar-active' : 'wallets-progress-bar-inactive';

                return (
                    <div
                        className={`${barClassname} ${isTransition ? 'wallets-progress-bar-transition' : ''}`}
                        key={`progress-bar-${currentIndex}`}
                        onClick={() => setActiveIndex(value)}
                    />
                );
            })}
        </div>
    );
};

export default ProgressBar;
