import React from 'react';
import classNames from 'classnames';

const Oval = ({ children }) => {
    return (
        <div className='dc-timeline__oval'>
            <span className='dc-timeline__number'>{children}</span>
        </div>
    );
};
const Title = ({ title, className }) => {
    return <div className={className}>{title}</div>;
};

const Timeline = ({ children }) => {
    return (
        <div>
            {children.map((child, idx) => (
                <div
                    className={classNames('dc-timeline__flex', {
                        'dc-timeline__flex--no-border': children.length === idx + 1,
                    })}
                >
                    <Oval>{idx + 1}</Oval>
                    <div className='dc-timeline__container' key={idx}>
                        <Title className='dc-timeline__title' title={child.props.title} />
                        <div className='dc-timeline__content'>{child}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
const Item = ({ children }) => <div>{children}</div>;
Timeline.Item = Item;
export default Timeline;
