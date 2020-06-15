import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../icon';

const checkStatus = (status, onClick) => {
    switch (status) {
        case 'done':
            return (
                <div className='dc-checklist__item-status--done'>
                    <Icon icon='IcCheckmark' color='green' size={16} />
                </div>
            );
        case 'action':
        default:
            return (
                <div className='dc-checklist__item-status--action' onClick={onClick}>
                    <Icon icon='IcArrowRightBold' color='active' />
                </div>
            );
    }
};

const Checklist = ({ items, className, itemClassName }) => (
    <div className={classNames('dc-checklist', className)}>
        {items.map((item, idx) => (
            <div
                key={idx}
                className={classNames('dc-checklist__item', itemClassName, {
                    'dc-checklist__item--disabled': item.is_disabled,
                })}
            >
                <div className='dc-checklist__item-text'>{item.content}</div>
                <div
                    className={classNames('dc-checklist__item-status', {
                        'dc-checklist__item-status--disabled': item.is_disabled,
                    })}
                >
                    {checkStatus(item.status, item.onClick)}
                </div>
            </div>
        ))}
    </div>
);

Checklist.propTypes = {
    items: PropTypes.array,
    className: PropTypes.string,
};

export default Checklist;
