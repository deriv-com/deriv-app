import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';

const DataListRow = props => {
    const [show_desc, setShowDesc] = React.useState(false);
    const {
        action_desc,
        destination_link,
        is_new_row,
        is_scrolling,
        is_top_up,
        measure,
        row_gap,
        row_key,
        row,
        rowRenderer,
    } = props;

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
                    <div className='data-list__item'>
                        {rowRenderer({ row, measure, is_new_row, isScrolling: is_scrolling, is_top_up })}
                    </div>
                </NavLink>
            ) : (
                <div className='data-list__item--wrapper'>
                    {action_desc ? (
                        <div className={'data-list__item'} onClick={() => setShowDesc(!show_desc)}>
                            {show_desc ? (
                                <div className={'data-list__desc--wrapper'}>
                                    {action_desc.component ? (
                                        <div>{action_desc.component}</div>
                                    ) : (
                                        <p className='statement__row--detail-text'>{action_desc.message}</p>
                                    )}
                                </div>
                            ) : (
                                rowRenderer({ row, measure, is_new_row, is_scrolling, is_top_up })
                            )}
                        </div>
                    ) : (
                        <div className='data-list__item'>
                            {rowRenderer({ row, measure, is_new_row, is_scrolling, is_top_up })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

DataListRow.propTypes = {
    action_desc: PropTypes.object,
    destination_link: PropTypes.string,
    is_scrolling: PropTypes.bool,
    is_new_row: PropTypes.bool,
    measure: PropTypes.func,
    row: PropTypes.object,
    row_gap: PropTypes.number,
    row_key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rowRenderer: PropTypes.func,
};

export default React.memo(DataListRow);
