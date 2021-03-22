import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import Text from '../text';
import Icon from '../icon/icon.jsx';

const DataListRow = ({ action_desc, destination_link, row_gap, row_key, rowRenderer, ...other_props }) => {
    const [show_desc, setShowDesc] = React.useState(false);
    const [is_copied, setIsCopied] = React.useState(false);

    const onCopySuccess = () => {
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 300);
    };

    const onClickCopy = event => {
        event.stopPropagation();
        navigator.clipboard.writeText(action_desc.message.split(/,| /)[1]).then(() => {
            onCopySuccess();
        });
    };

    const copy_to_clipboard = (
        <Icon
            icon={is_copied ? 'IcCheckmarkCircle' : 'IcCopy'}
            className='table__row--icon'
            onClick={event => onClickCopy(event)}
        />
    );

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
                    <div className='data-list__item'>{rowRenderer({ ...other_props })}</div>
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
                                        <Text as='p' size='xs' className='statement__row--detail-text' align='center'>
                                            {action_desc.message}
                                            {action_desc.message.includes(': ') ? copy_to_clipboard : null}
                                        </Text>
                                    )}
                                </div>
                            ) : (
                                rowRenderer({ ...other_props })
                            )}
                        </div>
                    ) : (
                        <div className='data-list__item'>{rowRenderer({ ...other_props })}</div>
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
};

export default React.memo(DataListRow);
