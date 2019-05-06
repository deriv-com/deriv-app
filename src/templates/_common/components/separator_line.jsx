import React from 'react';

export const SeparatorLine = ({
    no_wrapper,
    show_mobile,
    className,
    sub_class,
    invisible,
    data_show,
}) => {
    const classes1 = `${show_mobile ? '' : 'gr-hide-m'} ${className || ''}`.trim();
    const classes2 = `separator-line ${sub_class || ''} ${invisible ? '' : 'border-bottom'}`;

    return (
        <div data-show={data_show || undefined} className={!no_wrapper ? classes1 : undefined} >
            <div className={classes2 || undefined} />
        </div>
    );
};

export const SeparatorLineWithText = ({ text, className }) => (
    <div className={`${className || ''} section-divider`}>
        <div className='align-self-center border-bottom-light-gray' />
        <div className='circle'>{text}</div>
        <div className='align-self-center border-bottom-light-gray' />
    </div>
);
