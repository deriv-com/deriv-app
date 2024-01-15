import React from 'react';
import clsx from 'clsx';
import ArrowRightIcon from '../../public/ic-arrow-right.svg';
import CheckmarkIcon from '../../public/ic-checkmark.svg';
import './Checklist.scss';

const Checklist = ({ items }) => {
    return (
        <div className='p2p-v2-checklist'>
            {items.map((item, key) => (
                <div className='p2p-v2-checklist__item' key={key}>
                    <span className={clsx({ 'p2p-v2-checklist__text--disabled': item.is_disabled })}>{item.text}</span>
                    {item.status === 'done' ? (
                        <div className='p2p-v2-checklist__item-checkmark'>
                            <CheckmarkIcon className='p2p-v2-checklist__item-checkmark-icon' />
                        </div>
                    ) : (
                        <button
                            className={clsx('p2p-v2-checklist__item-button', {
                                'p2p-v2-checklist__item-button--disabled': item.is_disabled,
                            })}
                            disabled={item.is_disabled}
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
