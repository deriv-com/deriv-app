import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconProfitTable = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path className='color1-fill' fill='#7F8397' fillRule='nonzero' d='M6 7.707V12.5a.5.5 0 1 1-1 0V7.707L3.854 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 1 1-.708.708L6 7.707zm4 3.586V6.5a.5.5 0 1 1 1 0v4.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L10 11.293zM0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13zm1 0v13a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5zM1 4V3h14v1H1z' />
    </svg>
);

IconProfitTable.propTypes = {
    className: PropTypes.string,
};

export default IconProfitTable;
