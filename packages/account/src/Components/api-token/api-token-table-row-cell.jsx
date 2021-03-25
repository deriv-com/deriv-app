import classNames from 'classnames';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Text } from '@deriv/components';

const ApiTokenTableRowCell = ({ className, children, should_bypass_text }) => {
    if (should_bypass_text) {
        return <td className={classNames('da-api-token__table-cell', className)}>{children}</td>;
    }

    return (
        <td className={classNames('da-api-token__table-cell', className)}>
            <Text color='prominent ' size='xs' line_height='m'>
                {children}
            </Text>
        </td>
    );
};

ApiTokenTableRowCell.propTypes = {
    children: PropTypes.any.isRequired,
    should_bypass_text: PropTypes.bool,
};

export default ApiTokenTableRowCell;
