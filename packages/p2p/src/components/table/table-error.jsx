import React from 'react';
import PropTypes from 'prop-types';
import './table.scss';

export const TableError = ({ message }) => <p className='dp2p-table-error'>{message}</p>;

TableError.propTypes = {
    message: PropTypes.string,
};
