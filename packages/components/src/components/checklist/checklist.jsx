import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../icon';
import Button from '../button';

const ItemStatus = ({ status, onClick, button_text }) => {
    switch (status) {
        case 'done':
            return (
                <div className='dc-checklist__item-status--done'>
                    <Icon icon='IcCheckmark' color='green' size={16} />
                </div>
            );
        case 'button-action':
            return <Button primary color='active' text={button_text} onClick={onClick} />;
        case 'action':
        default:
            return (
                <div
                    className='dc-checklist__item-status--action'
                    data-testid='dt_checklist_item_status_action'
                    onClick={onClick}
                >
                    <Icon icon='IcArrowRightBold' color='active' />
                </div>
            );
    }
};

ItemStatus.propTypes = {
    button_text: PropTypes.string,
    onClick: PropTypes.func,
    status: PropTypes.string,
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
                        'dc-checklist__item-status--button': item.status === 'button-action',
                    })}
                >
                    <ItemStatus status={item.status} onClick={item.onClick} button_text={item.button_text} />
                </div>
            </div>
        ))}
    </div>
);

Checklist.propTypes = {
    items: PropTypes.array,
    className: PropTypes.string,
    itemClassName: PropTypes.string,
};

export default Checklist;
