import React from 'react';
import classNames from 'classnames';

const FlexWrapper = ({ children, className }) => <div className={className}>{children}</div>;
const Oval = ({ number }) => {
    return (
        <div className='dc-timeline__oval'>
            <span className='dc-timeline__oval-span'>{number}</span>
        </div>
    );
};
const Content = ({ body, className }) => {
    return <div className={className}>{body}</div>;
};
const Title = ({ title, className }) => {
    return <div className={className}>{title}</div>;
};

const Timeline = ({ children }) => {
    return (
        <div>
            {children.map((child, idx) => (
                <FlexWrapper
                    className={classNames('dc-timeline__flex', {
                        'dc-timeline__flex-noborder': children.length === idx + 1,
                    })}
                >
                    <Oval number={idx} />
                    <div className='dc-timeline' key={idx}>
                        <Title className='dc-timeline__title' title={child.props.title} />
                        <Content className='dc-timeline__content' body={child} />
                    </div>
                </FlexWrapper>
            ))}
        </div>
    );
};

export default Timeline;
