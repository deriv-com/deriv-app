import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { getKebabCase, getUrlBase } from '@deriv/shared';
import * as icons_manifest from './icons-manifest';

const Icon = React.forwardRef(
    (
        {
            className,
            color,
            custom_color,
            data_testid,
            height,
            icon,
            id,
            onClick,
            onMouseEnter,
            onMouseLeave,
            size = 16,
            width,
        },
        ref
    ) => {
        if (!icon) return null;

        let category = 'common';
        const category_match = new RegExp(`^Ic(${Object.keys(icons_manifest).join('|')})`, 'gi').exec(icon);
        if (category_match?.[1]) {
            category = getKebabCase(category_match[1]);
        }

        const sprite_id = icon.startsWith('IcUnderlying')
            ? `ic-underlying-${icon.split('IcUnderlying')[1].toUpperCase()}`
            : getKebabCase(icon);

        const filename = icons_manifest[category];

        return (
            <svg
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                className={classNames('dc-icon', className, {
                    'dc-icon--active': color === 'active',
                    'dc-icon--disabled': color === 'disabled',
                    'dc-icon--green': color === 'green' || icon === 'IcProfit',
                    'dc-icon--red': color === 'red' || icon === 'IcLoss',
                    'dc-icon--secondary': color === 'secondary',
                    'dc-icon--brand': color === 'brand',
                    'dc-icon--black': color === 'black',
                    'dc-icon--orange': color === 'orange',
                })}
                data-testid={data_testid}
                height={height || size}
                id={id}
                width={width || size}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                ref={ref}
                style={
                    custom_color
                        ? {
                              '--fill-color1': custom_color,
                          }
                        : undefined
                }
            >
                <use xlinkHref={`${getUrlBase(`/public/sprites/${filename}.svg`)}#${sprite_id}`} />
            </svg>
        );
    }
);

Icon.displayName = 'Icon';

Icon.propTypes = {
    className: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    custom_color: PropTypes.string,
    data_testid: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    icon: PropTypes.string,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    id: PropTypes.string,
};

export default React.memo(Icon);
