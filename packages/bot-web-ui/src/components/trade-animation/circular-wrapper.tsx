import React from 'react';
import classNames from 'classnames';

type TCircularWrapper = {
    className?: string;
};

const CircularWrapper: React.FC<TCircularWrapper> = ({ className }) => (
    <div className={classNames('circular-wrapper', className)}>
        <span className='static-circle' />
        <span className='dynamic-circle' />
    </div>
);

export default CircularWrapper;
