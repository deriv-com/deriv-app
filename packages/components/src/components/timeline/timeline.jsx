import PropTypes from 'prop-types';
import React from 'react';

const FlexWrapper = ({ children, removeBorder }) => (
    <div
        style={{
            display: 'flex',
            borderLeft: removeBorder || 'var(--brand-red-coral) solid 1px',
            marginLeft: '100px',
            position: 'relative',
        }}
    >
        {children}
    </div>
);
const Oval = ({ number }) => {
    return (
        <div
            style={{
                width: '24px',
                height: '24px',
                lineHeight: '24px',
                backgroundColor: 'var(--brand-red-coral)',
                borderRadius: '50%',
                textAlign: 'center',
                marginRight: '8px',
                position: 'absolute',
                left: '-12px',
            }}
        >
            <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>{number}</span>
        </div>
    );
};
const Content = ({ body }) => {
    return (
        <div
            style={{
                marginBottom: '16px',
                color: 'white',
            }}
        >
            {body}
        </div>
    );
};
const Title = ({ title }) => {
    return (
        <div
            style={{
                maxWidth: '500px',
                fontSize: '14px',
                marginBottom: '16px',
                color: 'white',
            }}
        >
            {title}
        </div>
    );
};

const Timeline = ({ children }) => {
    return (
        <div>
            {children.map((child, idx) => (
                <FlexWrapper removeBorder={children.length == idx + 1}>
                    <Oval number={idx}></Oval>
                    <div style={{ marginTop: '6px', marginLeft: '20px' }} key={idx}>
                        <Title title={child.props.title} />
                        <Content body={child} />
                    </div>
                </FlexWrapper>
            ))}
        </div>
    );
};

export default Timeline;
