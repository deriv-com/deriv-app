import PropTypes from 'prop-types';
import React from 'react';

const AutoHeightWrapper = props => {
    const [height, setHeight] = React.useState(props.default_height);
    const [child_ref, setChildRef] = React.useState(null);

    React.useEffect(() => {
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateHeight = () =>
        setHeight(
            child_ref.clientHeight > props.default_height
                ? child_ref.clientHeight - (props.height_offset || 0)
                : props.default_height
        );

    const setRef = ref => {
        setChildRef(ref);
        setTimeout(updateHeight, 0);
    };

    return props.children({
        ...props,
        height,
        setRef,
    });
};

AutoHeightWrapper.propTypes = {
    default_height: PropTypes.any.isRequired,
    children: PropTypes.any,
    height_offset: PropTypes.number,
};

export default AutoHeightWrapper;
