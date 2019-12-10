import React     from 'react';
import PropTypes from 'prop-types';

export const TableDimensions = ({ children }) => {
    const [dimensions, setDimensions] = React.useState({ width: null, height: null });
    const tableWrapper = React.useRef(null);

    React.useEffect(() => {
        const { offsetWidth: width, clientHeight: height } = tableWrapper.current;
        setDimensions({ width, height });
    },[]);

    return (
        <div
            ref={tableWrapper}
            style={{ height: '100%', width: '100%' }}
        >
            {children(dimensions)}
        </div>
    );
};
TableDimensions.propTypes = {
    children: PropTypes.any,
};
