import React from 'react';

export const FlexWrapper = ({ children }) => {
    const style = {
        display: 'flex',
        flexDirection: 'row',
        padding: '2rem',
        justifyContent: 'center',
    };
    return <div style={style}>{children}</div>;
};

export const GroupWrapper = ({ children }) => {
    const style = {
        display: 'flex',
        flexDirection: 'column',
        margin: '0 2rem',
    };
    return <div style={style}>{children}</div>;
};

export const Text = ({ children, size }) => {
    const style = {
        fontSize: size,
        color: 'var(--text-general)',
        margin: '2rem 0',
    };
    return <p style={style}>{children}</p>;
};

export const ButtonWrapper = ({ children }) => {
    const style = {
        margin: '1rem 0',
    };
    return <div style={style}>{children}</div>;
};
