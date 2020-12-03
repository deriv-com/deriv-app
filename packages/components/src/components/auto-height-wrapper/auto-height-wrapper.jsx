import PropTypes from 'prop-types';
import React from 'react';

const AutoHeightWrapper = props => {
    const [height, setHeight] = React.useState(props.default_height);
    const [ref, setRef] = React.useState(null);

    React.useEffect(() => {
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (ref) updateHeight();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);

    const updateHeight = () =>
        setHeight(
            ref.clientHeight > props.default_height
                ? ref.clientHeight - (props.height_offset || 0)
                : props.default_height
        );

    return props.children({
        ...props,
        height,
        setRef,
    });
};

AutoHeightWrapper.propTypes = {
    default_height: PropTypes.any,
    children: PropTypes.any,
    height_offset: PropTypes.number,
};

export default AutoHeightWrapper;
