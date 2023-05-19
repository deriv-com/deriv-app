import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import './table-error.scss';

export const TableError = ({ message }) => (
    <Text as='p' color='loss-danger' size='xs' className='table-error'>
        {message}
    </Text>
);

TableError.propTypes = {
    message: PropTypes.string,
};
