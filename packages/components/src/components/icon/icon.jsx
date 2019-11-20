import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

function getKebabCase(str) {
    if (!str) return str;
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // get all lowercase letters that are near to uppercase ones
        .replace(/[\s]+/g, '-')                 // replace all spaces and low dash
        .toLowerCase();
}

const Icon = ({
    active,
    className,
    color,
    disabled,
    green,
    height,
    icon,
    onClick,
    red,
    secondary,
    size = 16,
    width,
}) => {
    let spriteFileName = 'common';
    if (icon) {
        if (icon.startsWith('IcCurrency')) {
            spriteFileName = 'currency';
        }
        if (icon.startsWith('IcTradetype')) {
            spriteFileName = 'tradetype';
        }
        if (icon.startsWith('IcMt5')) {
            spriteFileName = 'mt5';
        }
        if (icon.startsWith('IcFlag')) {
            spriteFileName = 'flag';
        }
        if (icon.startsWith('IcUnderlying')) {
            spriteFileName = 'underlying';
        }
        if (icon.startsWith('IcPoa') || icon.startsWith('IcPoi')) {
            spriteFileName = 'account';
        }
    }

    const icon_filename = icon.startsWith('IcUnderlying') ? `ic-underlying-${icon.split('IcUnderlying')[1]}` : getKebabCase(icon);

    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            className={classNames('dc-icon', className, {
                'dc-icon--active'   : active,
                'dc-icon--disabled' : disabled,
                'dc-icon--green'    : green,
                'dc-icon--red'      : red,
                'dc-icon--secondary': secondary,
                'dc-icon--color'    : color,
            })}
            height={height || size}
            width={width || size}
            onClick={onClick}
        >
            <use xlinkHref={`${(`/${spriteFileName}.svg`)}#${icon_filename}`} />
        </svg>
    );
};

Icon.propTypes = {
    active   : PropTypes.bool,
    className: PropTypes.string,
    color    : PropTypes.bool,
    disabled : PropTypes.bool,
    green    : PropTypes.bool,
    height   : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    icon     : PropTypes.string,
    onClick  : PropTypes.func,
    red      : PropTypes.bool,
    secondary: PropTypes.bool,
    size     : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    width: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default Icon;
