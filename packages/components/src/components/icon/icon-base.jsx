import React from 'react';

function getThemifiedProps(Svg, theme, key) {
    if (!Svg || !Svg.props) return Svg;

    const { type } = Svg;
    const { children, ...props } = Svg.props;

    const themifiedProps = [];
    Object.keys(theme).map(rule => {
        const [element, attribute] = rule.split('&');
        if (props['data-theme'] === 'none') return themifiedProps.push(Svg);
        if (type === 'path') {
            if (attribute && props[attribute]) {
                themifiedProps.push(React.cloneElement(Svg, { key, className: theme[rule] }));
            }
        }
        if (type === element) {
            themifiedProps.push(React.cloneElement(Svg, { key, className: theme[rule] }));
        }
        if (attribute) {
            const [attr, value] = attribute.split('=');
            if (value && props[attr] === value) {
                themifiedProps.push(React.cloneElement(Svg, { key, className: theme[rule] }));
            }
        }
    });

    const childrenWithProps = [];
    if (children) {
        React.Children.map(children, (child, idx) => {
            childrenWithProps.push(getThemifiedProps(child, theme, idx));
        });
    }

    if (themifiedProps[0]) {
        return React.cloneElement(themifiedProps[0], { key, children: childrenWithProps });
    }
    return React.cloneElement(Svg, { key, children: childrenWithProps });
}

const IconBase = Svg => {
    if (!Svg || !Svg.props) return <div />;

    const {
        children,
        className,
        colors,
        height,
        theme,
        width,
    } = Svg.props;

    let childrenWithProps;
    
    if (theme === 'none') {
        childrenWithProps = children;
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
            'g'              : 'color2-fill',
            
        };
        childrenWithProps = getThemifiedProps(children, fillColors);
    }
    
    if (colors) {
        childrenWithProps = getThemifiedProps(children, colors);
    }

    return (
        <svg
            className={`inline-icon ${className || ''}`}
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
