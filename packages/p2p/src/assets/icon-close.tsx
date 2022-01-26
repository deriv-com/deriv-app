import classNames from 'classnames';
import React from 'react';

type IconCloseProps = {
    className: string,
    onClick: () => void
};

const IconClose = (
    {
        className,
        onClick
    }: IconCloseProps
) => <svg
    className={classNames('inline-icon', className)}
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    onClick={onClick}
>
    <path
        className='color1-fill'
        fillOpacity='0.8'
        d='M8 6.587l4.293-4.294a1 1 0 0 1 1.414 1.414L9.414 8.002l4.293 4.294a1 1 0 0 1-1.414 1.414L8 9.416 3.707 13.71a1 1 0 1 1-1.414-1.414l4.293-4.294-4.293-4.295a1 1 0 1 1 1.414-1.414L8 6.587z'
    />
</svg>;

export default IconClose;
