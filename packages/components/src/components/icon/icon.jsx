import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';
import { getKebabCase } from '@deriv/shared/utils/string';
import { getUrlBase } from '@deriv/shared/utils/url';
import { colors } from 'Components/theme-provider/theme-config';

const IconSvg = styled.svg`
    --fill-color1: ${props => {
        return props.theme.text.general;
    }};
    --fill-color2: ${props => props.theme.text.less_prominent};
    --fill-color3: ${props => props.theme.general.section_1};

    ${props => {
        if (props.icon === 'IcProfit' || props.color === 'green')
            return css`
                --fill-color1: ${props.theme.text.profit_success};
                --fill-color2: ${props.theme.text.profit_success};
                --fill-color3: ${colors.white};
            `;
        if (props.icon === 'IcLoss' || props.color === 'red')
            return css`
                --fill-color1: ${props.theme.text.loss_danger};
                --fill-color2: ${props.theme.text.loss_danger};
                --fill-color3: ${colors.white};
            `;

        switch (props.color) {
            case 'active':
                return css`
                    --fill-color1: ${colors.white};
                    --fill-color2: ${colors.white};
                `;
            case 'disabled':
                return css`
                    --fill-color1: ${props.theme.text.loss_danger};
                    --fill-color2: ${props.theme.text.loss_danger};
                `;
            case 'secondary':
                return css`
                    --fill-color1: ${props.theme.text.less_prominent};
                    --fill-color2: ${props.theme.text.less_prominent};
                    --fill-color3: ${colors.white};
                `;
            case 'brand':
                return css`
                    --fill-color1: ${props.theme.brand.red_coral};
                    --fill-color2: ${props.theme.brand.secondary};
                    --fill-color3: ${colors.white};
                `;
            default:
                return '';
        }
    }}
`;

const Icon = ({
    className,
    color,
    custom_color,
    height,
    icon,
    id,
    onClick,
    onMouseEnter,
    onMouseLeave,
    size = 16,
    width,
}) => {
    if (!icon) return null;

    let filename = 'common';
    const filenames = /^Ic(Currency|Tradetype|Mt5|Flag|Underlying)/g.exec(icon);
    if (filenames) {
        filename = getKebabCase(filenames[1]);
    }

    const sprite_id = icon.startsWith('IcUnderlying')
        ? `ic-underlying-${icon.split('IcUnderlying')[1].toUpperCase()}`
        : getKebabCase(icon);

    return (
        <IconSvg
            className={className}
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            height={height || size}
            id={id}
            width={width || size}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            color={color}
            icon={icon}
            style={
                custom_color
                    ? {
                          '--fill-color1': custom_color,
                      }
                    : undefined
            }
        >
            <use xlinkHref={`${getUrlBase(`/public/images/sprite/${filename}.svg`)}#${sprite_id}`} />
        </IconSvg>
    );
};

Icon.propTypes = {
    className: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    custom_color: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    icon: PropTypes.string,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default React.memo(Icon);
