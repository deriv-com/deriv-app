import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useIsMounted } from '@deriv/shared';

const DataListRow = ({
    action_desc,
    destination_link,
    row_gap,
    row_key,
    rowRenderer,
    measure,
    is_dynamic_height,
    ...other_props
}) => {
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

DataListRow.propTypes = {
    action_desc: PropTypes.object,
    destination_link: PropTypes.string,
    row_gap: PropTypes.number,
    row_key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rowRenderer: PropTypes.func,
    measure: PropTypes.func,
    is_dynamic_height: PropTypes.bool,
};

export default React.memo(DataListRow);
