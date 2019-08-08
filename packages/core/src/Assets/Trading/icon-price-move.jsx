import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconPriceMove = ({ type, className, classNamePath }) => {
    let IconType;
    if (type) {
        switch (type) {
            case 'profit':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className={classNamePath || undefined} fill='#2BC8A5' fillRule='nonzero' d='M8 4l6 8H2z' />
                    </g>
                );
                break;
            case 'loss':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className={classNamePath || undefined} fill='#E31C4B' fillRule='nonzero' d='M8 12l6-8H2z' />
                    </g>
                );
                break;
            default:
                IconType = (
                    <path className={classNamePath || undefined} fill='#B0B3BF' fillRule='evenodd' d='M7 10.4L7.4 9 8 7.9l1-1c.4-.5.6-1 .6-1.5 0-.6-.1-1-.4-1.3-.2-.3-.6-.4-1.2-.4-.5 0-.9.1-1.2.4-.3.3-.4.6-.4 1H5c0-.7.3-1.4.9-1.9.5-.5 1.2-.7 2.1-.7 1 0 1.7.3 2.2.8.5.5.8 1.1.8 2 0 .9-.4 1.7-1.2 2.6l-.8.8c-.4.4-.5 1-.5 1.7H7zm0 2.3c0-.2 0-.4.2-.5l.6-.3c.3 0 .5.1.6.3.2.1.2.3.2.5 0 .3 0 .4-.2.6l-.6.2c-.2 0-.4 0-.6-.2a.8.8 0 0 1-.2-.6z' />
                );
                break;
        }
    }
    return (
        type ?
            <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'>
                {IconType}
            </svg> : null

    );
};

IconPriceMove.propTypes = {
    className: PropTypes.string,
    type     : PropTypes.string,
};

export default IconPriceMove;
