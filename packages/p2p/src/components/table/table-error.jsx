import React from 'react';
import PropTypes from 'prop-types';
import './table.scss';
import { Text } from '@deriv/components';

export const TableError = ({ message }) => (
    <Text as='p' color='loss-danger' size='xs' className='dp2p-table-error'>
        {message}
    </Text>
);

TableError.propTypes = {
    message: PropTypes.string,
};
