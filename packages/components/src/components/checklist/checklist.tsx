import React from 'react';
import classNames from 'classnames';
import Icon from '../icon';
import Button from '../button';

type TItemStatusProps = {
    button_text?: string;
    onClick: () => void;
    status: string;
};

type TChecklistItem = TItemStatusProps & {
    is_disabled?: boolean;
    content: string | JSX.Element;
};

type TChecklistProps = {
    items: TChecklistItem[];
    className: string;
    itemClassName?: string;
};

const ItemStatus = ({ status, onClick, button_text }: TItemStatusProps) => {
    const onItemStatusClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        onClick();
    };

    switch (status) {
        case 'done':
            return (
                <div className='dc-checklist__item-status--done'>
                    <Icon icon='IcCheckmark' color='green' size={16} />
                </div>
            );
        case 'button-action':
            return <Button primary color='active' text={button_text} onClick={onItemStatusClick} />;
        case 'action':
        default:
            return (
                <div
                    className='dc-checklist__item-status--action'
                    data-testid='dt_checklist_item_status_action'
                    onClick={onItemStatusClick}
                >
                    <Icon icon='IcArrowRightBold' color='active' />
                </div>
            );
    }
};

const Checklist = ({ items, className, itemClassName }: TChecklistProps) => (
    <div className={classNames('dc-checklist', className)}>
        {items.map((item, idx) => (
            <div
                key={idx}
                className={classNames('dc-checklist__item', itemClassName, {
                    'dc-checklist__item--disabled': item.is_disabled,
                })}
                onClick={item.onClick}
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

export default Checklist;
