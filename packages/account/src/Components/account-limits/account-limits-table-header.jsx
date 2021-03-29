import PropTypes from 'prop-types';
import * as React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';

const AccountLimitsTableHeader = ({ align, children, renderExtraInfo }) => {
    return (
        <th
            className={classNames('da-account-limits__table-header', {
                'da-account-limits__table-header--left': align !== 'right',
                'da-account-limits__table-header--right': align === 'right',
            })}
        >
            {children && (
                <Text align={align} as='p' color='prominent' size='xxs' line_height='m' weight='bold'>
                    {children}
                </Text>
            )}
            {renderExtraInfo && renderExtraInfo()}
        </th>
    );
};

AccountLimitsTableHeader.propTypes = {
    align: PropTypes.oneOf(['right', 'left']),
    children: PropTypes.any,
};

export default AccountLimitsTableHeader;
