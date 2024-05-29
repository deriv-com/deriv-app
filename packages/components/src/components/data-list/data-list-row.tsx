import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useIsMounted, clickAndKeyEventHandler } from '@deriv/shared';
import { TPassThrough, TRow } from '../types/common.types';
import { TColIndex, TDataListCell } from './data-list-cell';
import { TSource } from '../data-table/table-row';
import { useDebounce } from '../../hooks/use-debounce';

type TMobileRowRenderer = {
    row?: TRow;
    is_footer?: boolean;
    columns_map?: Record<TColIndex, TDataListCell['column']>;
    server_time?: moment.Moment;
    onClickCancel: (contract_id?: number) => void;
    onClickSell: (contract_id?: number) => void;
    measure?: () => void;
    passthrough?: TPassThrough;
};

export type TRowRenderer = (params: Partial<TMobileRowRenderer>) => React.ReactNode;

type TDataListRow = {
    action_desc?: {
        component: React.ReactNode;
    };
    destination_link?: string;
    row_gap?: number;
    row_key: string | number;
    rowRenderer: TRowRenderer;
    measure?: () => void;
    is_dynamic_height?: boolean;
    is_new_row: boolean;
    is_scrolling: boolean;
    passthrough?: TPassThrough;
    row: TSource;
};

const DataListRow = ({
    action_desc,
    destination_link,
    row_gap,
    row_key,
    rowRenderer,
    measure,
    is_dynamic_height,
    ...other_props
}: TDataListRow) => {
    const [show_description, setShowDescription] = React.useState(false);
    const isMounted = useIsMounted();
    const debouncedHideDetails = useDebounce(() => setShowDescription(false), 5000);

    const toggleDetails = () => {
        if (action_desc) {
            setShowDescription(!show_description);
            debouncedHideDetails();
        }
    };

    const toggleDetailsDecorator = (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        clickAndKeyEventHandler(toggleDetails, e);
    };

    React.useEffect(() => {
        if (isMounted() && is_dynamic_height) {
            measure?.();
        }
    }, [show_description, is_dynamic_height, measure]);

    return (
        <div className='data-list__row--wrapper' style={{ paddingBottom: `${row_gap || 0}px` }}>
            {destination_link ? (
                <NavLink
                    className='data-list__item--wrapper'
                    id={`dt_reports_contract_${row_key}`}
                    to={{
                        pathname: destination_link,
                        state: {
                            from_table_row: true,
                        },
                    }}
                >
                    <div className='data-list__item'>{rowRenderer({ measure, ...other_props })}</div>
                </NavLink>
            ) : (
                <div
                    className={classNames('data-list__item--wrapper', {
                        'data-list__item--dynamic-height-wrapper': is_dynamic_height,
                    })}
                >
                    {action_desc ? (
                        <div
                            className='data-list__item'
                            onClick={toggleDetailsDecorator}
                            onKeyDown={toggleDetailsDecorator}
                        >
                            {show_description ? (
                                <div className='data-list__desc--wrapper'>
                                    {action_desc.component && <div>{action_desc.component}</div>}
                                </div>
                            ) : (
                                rowRenderer({ measure, ...other_props })
                            )}
                        </div>
                    ) : (
                        <div className='data-list__item'>{rowRenderer({ measure, ...other_props })}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default React.memo(DataListRow);
