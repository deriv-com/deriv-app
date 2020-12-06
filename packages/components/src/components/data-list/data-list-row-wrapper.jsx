import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';

// eslint-disable-next-line react/display-name
const DataListRowWrapper = React.memo(props => {
    const [showDetails, setShowDetails] = React.useState(false);
    const { to, replace, row_key, row_gap } = props;

    return (
        <div className='data-list__row--wrapper' style={{ paddingBottom: `${row_gap || 0}px` }}>
            {to ? (
                <NavLink
                    className='data-list__item--wrapper'
                    id={`dt_reports_contract_${row_key}`}
                    to={{
                        pathname: to,
                        state: {
                            from_table_row: true,
                        },
                    }}
                >
                    {props.children}
                </NavLink>
            ) : (
                <div className='data-list__item--wrapper'>
                    {replace ? (
                        <div className={'data-list__item'} onClick={() => setShowDetails(!showDetails)}>
                            {showDetails ? (
                                <div className={'data-list__desc--wrapper'}>
                                    {replace.component ? (
                                        <div>{replace.component}</div>
                                    ) : (
                                        <p className='statement__row--detail-text'>{replace.message}</p>
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
