import classNames from 'classnames';
import React from 'react';
import { getKebabCase, getUrlBase } from '@deriv/shared';
import * as icons_manifest from './icons-manifest';
import { TIconsManifest, TIconProps } from '../types';

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
        }: TIconProps,
        ref?: React.ForwardedRef<SVGSVGElement | null>
    ) => {
        if (!icon) return null;

        let category: keyof TIconsManifest = 'common';
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
                    (custom_color
                        ? {
                              '--fill-color1': custom_color,
                          }
                        : undefined) as React.CSSProperties & { '--fill-color1': string }
                }
            >
                <use xlinkHref={`${getUrlBase(`/public/sprites/${filename}.svg`)}#${sprite_id}`} />
            </svg>
        );
    }
);

Icon.displayName = 'Icon';

export default React.memo(Icon);
