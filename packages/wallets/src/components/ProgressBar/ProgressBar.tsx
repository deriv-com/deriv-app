import React from 'react';
import './ProgressBar.scss';

type TProps = {
    active_index: number;
    indexes: string[];
    is_transition?: boolean;
    setActiveIndex: (index: string) => void;
};

const ProgressBar: React.FC<TProps> = ({ active_index, indexes, is_transition = true, setActiveIndex }) => {
    return (
        <div className='wallets-progress-bar'>
            {indexes.map((value, idx) => {
                const current_index = idx + 1;
                const is_active = current_index === active_index;

                const bar_classname = is_active ? 'wallets-progress-bar-active' : 'wallets-progress-bar-inactive';

                return (
                    <div
                        className={`${bar_classname} ${is_transition ? 'wallets-progress-bar-transition' : ''}`}
                        key={`progress-bar-${current_index}`}
                        onClick={() => setActiveIndex(value)}
                    />
                );
            })}
        </div>
    );
};

export default ProgressBar;
