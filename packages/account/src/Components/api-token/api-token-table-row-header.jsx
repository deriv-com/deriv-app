import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';

const ApiTokenTableRowHeader = ({ text }) => (
    <th className='da-api-token__table-header'>
        <Text color='prominent ' size='xs' line_height='m' weight='bold'>
            {text}
        </Text>
    </th>
);

ApiTokenTableRowHeader.propTypes = {
    text: PropTypes.string.isRequired,
};

export default ApiTokenTableRowHeader;
