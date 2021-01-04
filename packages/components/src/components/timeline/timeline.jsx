import React from 'react';
import classNames from 'classnames';

const Oval = ({ children, is_disabled = false }) => {
    return (
        <div
            className={classNames('dc-timeline__oval', {
                'dc-timeline__oval--disabled': is_disabled,
            })}
        >
            <span className='dc-timeline__number'>{children}</span>
        </div>
    );
};

const Timeline = ({ children, disabled_items, ...props }) => {
    return (
        <div {...props}>
            {children.map((child, idx) => (
                <div
                    key={idx}
                    className={classNames('dc-timeline__flex', {
                        'dc-timeline__flex--no-border': children.length === idx + 1,
                    })}
                >
                    <Oval is_disabled={disabled_items && disabled_items.includes(idx + 1)}>{idx + 1}</Oval>
                    <div className='dc-timeline__container'>
                        <h2 className='dc-timeline__title'>{child.props.item_title}</h2>
                        <div className='dc-timeline__content'>{child}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Item = ({ children, ...props }) => <div {...props}>{children}</div>;

Timeline.Item = Item;

export default Timeline;
