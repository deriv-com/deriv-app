import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';

// eslint-disable-next-line react/display-name
const DataListRowWrapper = React.memo(props => {
    const [showDesc, setShowDesc] = React.useState(false);
    const { destination_link, acion_desc, row_key, row_gap } = props;

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
                    {props.children}
                </NavLink>
            ) : (
                <div className='data-list__item--wrapper'>
                    {acion_desc ? (
                        <div className={'data-list__item'} onClick={() => setShowDesc(!showDesc)}>
                            {showDesc ? (
                                <div className={'data-list__desc--wrapper'}>
                                    {acion_desc.component ? (
                                        <div>{acion_desc.component}</div>
                                    ) : (
                                        <p className='statement__row--detail-text'>{acion_desc.message}</p>
                                    )}
                                </div>
                            ) : (
                                props.children
                            )}
                        </div>
                    ) : (
                        props.children
                    )}
                </div>
            )}
        </div>
    );
});

DataListRowWrapper.propTypes = {
    to: PropTypes.string,
    replace: PropTypes.object,
    row_key: PropTypes.string,
    row_gap: PropTypes.number,
};

export default DataListRowWrapper;
