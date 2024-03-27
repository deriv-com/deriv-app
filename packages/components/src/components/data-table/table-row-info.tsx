import classNames from 'classnames';
import React from 'react';
import ThemedScrollbars from '../themed-scrollbars';
import { clickAndKeyEventHandler } from '@deriv/shared';
import { TTableRowItem } from '../types/common.types';
import { useDebounce } from '../../hooks/use-debounce';

type TTableRowIndex = {
    replace: TTableRowItem | undefined;
    is_footer: boolean;
    cells: React.ReactElement;
    className?: string;
    is_dynamic_height: boolean;
    measure?: () => void;
};

const TableRowInfo = ({ replace, is_footer, cells, className, is_dynamic_height, measure }: TTableRowIndex) => {
    const [show_details, setShowDetails] = React.useState(false);
    const debouncedHideDetails = useDebounce(() => setShowDetails(false), 5000);

    const toggleDetails = () => {
        if (replace) {
            setShowDetails(!show_details);
            debouncedHideDetails();
        }
    };

    const toggleDetailsDecorator = (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        clickAndKeyEventHandler(toggleDetails, e);
    };

    React.useEffect(() => {
        if (is_dynamic_height) {
            measure?.();
        }
    }, [show_details, is_dynamic_height, measure]);

    if (is_dynamic_height) {
        return (
            <div
                onClick={is_footer || !replace ? undefined : toggleDetailsDecorator}
                onKeyDown={is_footer || !replace ? undefined : toggleDetailsDecorator}
                className={classNames(className, { 'statement__row--detail': show_details })}
            >
                {show_details && typeof replace === 'object' ? <div>{replace?.component}</div> : cells}
            </div>
        );
    }
    return (
        <div
            onClick={is_footer || !replace ? undefined : toggleDetailsDecorator}
            onKeyDown={is_footer || !replace ? undefined : toggleDetailsDecorator}
            className={classNames(className, { 'statement__row--detail': show_details })}
        >
            {show_details && typeof replace === 'object' ? (
                <ThemedScrollbars height='80px'>
                    <div>{replace?.component}</div>
                </ThemedScrollbars>
            ) : (
                cells
            )}
        </div>
    );
};

export default TableRowInfo;
