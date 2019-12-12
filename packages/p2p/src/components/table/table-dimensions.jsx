import React     from 'react';
import PropTypes from 'prop-types';

export const TableDimensions = ({ children }) => {
    const [dimensions, setDimensions] = React.useState({ width: null, height: null });
    const tableWrapper = React.useRef(null);

    const tableResize = () => {
        const table_width  = tableWrapper.current.clientWidth;
        const table_height = tableWrapper.current.clientHeight;
        setDimensions({ width: table_width, height: table_height });
    };

    React.useEffect(() => {
        const { clientWidth: width, clientHeight: height } = tableWrapper.current;
        setDimensions({ width, height });
        window.onresize = tableResize;
    }, []);

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
