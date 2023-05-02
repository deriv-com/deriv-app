import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useIsMounted } from '@deriv/shared';
import { TPassThrough, TRow, TRowRenderer } from './data-list';

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
    row: TRow;
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
    const [show_desc, setShowDesc] = React.useState(false);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (isMounted() && is_dynamic_height) {
            measure?.();
        }
    }, [show_desc, is_dynamic_height, measure]);
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
                        <div className={'data-list__item'} onClick={() => setShowDesc(!show_desc)}>
                            {show_desc ? (
                                <div className={'data-list__desc--wrapper'}>
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
