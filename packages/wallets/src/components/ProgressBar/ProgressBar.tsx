import React from 'react';
import './ProgressBar.scss';

type TProps = {
    is_transition?: boolean;
    active_index: number;
    indexes: Array<string>;
    setActiveIndex: (index: string) => void;
};

const ProgressBar: React.FC<TProps> = ({ is_transition = 'true', active_index, indexes, setActiveIndex }) => {
    return (
        <div className='wallets-progress-bar'>
            {indexes.map((step, idx) => {
                const current_index = idx + 1;
                const is_active = current_index === active_index;

                const bar_classname = is_active ? 'wallets-progress-bar-active' : 'wallets-progress-bar-inactive';
                return (
                    <div
                        key={`progress-bar__${current_index}`}
                        onClick={() => setActiveIndex(step)}
                        className={`${bar_classname} ${is_transition ? 'wallets-progress-bar-transition' : ''}`}
                    />
                );
            })}
        </div>
    );
};

export default ProgressBar;
