import classNames from 'classnames';
import React from 'react';
import ThemedScrollbars from '../themed-scrollbars';

type TableRowInfoProps = {
    cells: unknown;
    className: string;
    replace: unknown;
    is_footer: boolean;
    is_dynamic_height: boolean;
    measure: () => void;
};

const TableRowInfo = ({ replace, is_footer, cells, className, is_dynamic_height, measure }: TableRowInfoProps) => {
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
    }, [show_details]);

    return (
        <div
            onClick={is_footer || !replace ? undefined : toggleDetails}
            className={classNames(className, { 'statement__row--detail': show_details })}
        >
            {show_details ? (
                is_dynamic_height ? (
                    <div>{replace?.component}</div>
                ) : (
                    <ThemedScrollbars height='80px'>
                        <div>{replace?.component}</div>
                    </ThemedScrollbars>
                )
            ) : (
                cells
            )}
        </div>
    );
};

export default TableRowInfo;
