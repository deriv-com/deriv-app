import React from 'react';

function getThemifiedProps(Svg, theme, key) {
    if (!Svg || !Svg.props) return Svg;

    const { type } = Svg;
    const { children, ...props } = Svg.props;

    const themifiedProps = Object.keys(theme).map(rule => {
        const [element, attribute] = rule.split('&');

        if (attribute) {
            const [attr, value] = attribute.split('=');
            if (value && props[attr] === value) {
                return React.cloneElement(Svg, { key, className: theme[rule] });
            } 
        } else if (element === type) {
            return React.cloneElement(Svg, { key, className: theme[rule] });
        }

        if ((props['data-theme'] === 'none')
            || (props[attribute] === 'none')
            || !props[attribute]
            // || type !== 'path'
            ) {
            return undefined;
        } else {
            return React.cloneElement(Svg, { key, className: theme[rule] });
        }
    }).filter(c => c !== undefined)[0];

    if (themifiedProps) {
        return themifiedProps;
    }

    const childrenWithProps = [];
    React.Children.map(children, (child, idx) => {
        childrenWithProps.push(getThemifiedProps(child, theme, idx));
    });

    return React.cloneElement(Svg, { key, children: childrenWithProps });
}

const IconBase = Svg => {
    if (!Svg || !Svg.props) return <div />;

    const {
        children,
        className,
        customColors,
        height,
        theme,
        width,
    } = Svg.props;

    let childrenWithProps;
    
    if (theme === 'none') {
        childrenWithProps = children;
    } else if (customColors) {
        childrenWithProps = getThemifiedProps(children, customColors);
    } else if (theme === 'twoTone') {
        const twoToneColors = {
            'rect'  : 'bg-fill',
            'circle': 'bg-fill',
            'path'  : 'path-fill',
        };
        childrenWithProps = getThemifiedProps(children, twoToneColors);
    } else if (!theme || theme === 'outline') {
        const fillColors = {
            '&fill'          : 'color1-fill',
            '&stroke'        : 'color1-stroke',
            '&strokeLinejoin': 'color1-stroke',
        };
        childrenWithProps = getThemifiedProps(children, fillColors);
    }

    return (
        <svg
            className={`inline-icon ${className}`}
            height={height}
            width={width}
            viewBox={`0 0 ${width} ${height}`}
            xmlns='http://www.w3.org/2000/svg'
        >
            {childrenWithProps}
        </svg>
    );
};

export default IconBase;
