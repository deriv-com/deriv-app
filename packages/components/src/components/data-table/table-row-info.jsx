import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ThemedScrollbars from '../themed-scrollbars';

const TableRowInfo = ({ replace, is_footer, cells, className, is_dynamic_height, measure }) => {
    const [show_details, setShowDetails] = React.useState(false);

    const toggleDetails = () => {
        if (replace) {
            setShowDetails(!show_details);
        }
    };

    React.useEffect(() => {
        if (is_dynamic_height) {
            measure?.();
        }
    }, [show_details, is_dynamic_height, measure]);

    if (is_dynamic_height) {
        return (
            <div
                onClick={is_footer || !replace ? undefined : toggleDetails}
                className={classNames(className, { 'statement__row--detail': show_details })}
            >
                {show_details ? <div>{replace?.component}</div> : cells}
            </div>
        );
    }
    return (
        <div
            onClick={is_footer || !replace ? undefined : toggleDetails}
            className={classNames(className, { 'statement__row--detail': show_details })}
        >
            {show_details ? (
                <ThemedScrollbars height='80px'>
                    <div>{replace?.component}</div>
                </ThemedScrollbars>
            ) : (
                cells
            )}
        </div>
    );
};

TableRowInfo.propTypes = {
    cells: PropTypes.arrayOf(PropTypes.node),
    className: PropTypes.string,
    replace: PropTypes.shape({
        component: PropTypes.object,
        message: PropTypes.string,
    }),
    is_footer: PropTypes.bool,
    is_dynamic_height: PropTypes.bool,
    measure: PropTypes.func,
};

export default TableRowInfo;
