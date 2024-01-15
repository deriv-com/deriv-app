import React from 'react';
import clsx from 'clsx';
import ArrowRightIcon from '../../public/ic-arrow-right.svg';
import CheckmarkIcon from '../../public/ic-checkmark.svg';
import './Checklist.scss';

type TChecklistItem = {
    isDisabled?: boolean;
    onClick?: () => void;
    status: string;
    text: string;
};

const Checklist = ({ items }: { items: TChecklistItem[] }) => {
    return (
        <div className='p2p-v2-checklist'>
            {items.map((item, key) => (
                <div className='p2p-v2-checklist__item' key={key}>
                    <span className={clsx({ 'p2p-v2-checklist__text--disabled': item.isDisabled })}>{item.text}</span>
                    {item.status === 'done' ? (
                        <div className='p2p-v2-checklist__item-checkmark'>
                            <CheckmarkIcon className='p2p-v2-checklist__item-checkmark-icon' />
                        </div>
                    ) : (
                        <button
                            className={clsx('p2p-v2-checklist__item-button', {
                                'p2p-v2-checklist__item-button--disabled': item.isDisabled,
                            })}
                            disabled={item.isDisabled}
                            onClick={item.onClick}
                        >
                            <ArrowRightIcon className='p2p-v2-checklist__item-button-icon' />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Checklist;
