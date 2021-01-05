import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';

const DataListRow = props => {
    const [show_desc, setShowDesc] = React.useState(false);
    const { destination_link, acion_desc, row_key, row_gap } = props;
    const { rowRenderer, row, measure, is_scrolling, is_new_row } = props;

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
                        {rowRenderer({ row, measure, isScrolling: is_scrolling, is_new_row })}
                    </div>
                </NavLink>
            ) : (
                <div className='data-list__item--wrapper'>
                    {acion_desc ? (
                        <div className={'data-list__item'} onClick={() => setShowDesc(!show_desc)}>
                            {show_desc ? (
                                <div className={'data-list__desc--wrapper'}>
                                    {acion_desc.component ? (
                                        <div>{acion_desc.component}</div>
                                    ) : (
                                        <p className='statement__row--detail-text'>{acion_desc.message}</p>
                                    )}
                                </div>
                            ) : (
                                rowRenderer({ row, measure, is_scrolling, is_new_row })
                            )}
                        </div>
                    ) : (
                        <div className='data-list__item'>{rowRenderer({ row, measure, is_scrolling, is_new_row })}</div>
                    )}
                </div>
            )}
        </div>
    );
};

DataListRow.propTypes = {
    acion_desc: PropTypes.object,
    destination_link: PropTypes.string,
    is_scrolling: PropTypes.bool,
    is_new_row: PropTypes.bool,
    measure: PropTypes.func,
    row: PropTypes.object,
    row_gap: PropTypes.number,
    row_key: PropTypes.string,
    rowRenderer: PropTypes.func,
};

export default React.memo(DataListRow);
