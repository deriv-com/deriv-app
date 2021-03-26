import PropTypes from 'prop-types';
import * as React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';

const AccountLimitsTableCell = ({ align, children, is_hint, renderExtraInfo }) => {
    const text_size = is_hint ? 'xxxs' : 'xxs';

    return (
        <React.Fragment>
            <td
                className={classNames('da-account-limits__table-cell', {
                    'da-account-limits__table-cell--left': align !== 'right',
                    'da-account-limits__table-cell--right': align === 'right',
                })}
            >
                {children && (
                    <Text align={align} as='p' color='prominent' size={text_size} line_height='m'>
                        {children}
                    </Text>
                )}
                {renderExtraInfo && renderExtraInfo()}
            </td>
        </React.Fragment>
    );
};

AccountLimitsTableCell.propTypes = {
    align: PropTypes.oneOf(['right', 'left']),
    children: PropTypes.any,
    is_hint: PropTypes.bool,
    renderExtraInfo: PropTypes.func,
};

export default AccountLimitsTableCell;
