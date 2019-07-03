import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconStatement = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path className='color1-fill' fill='#7F8397' fillRule='nonzero' d='M5.5 7h7a.5.5 0 1 1 0 1h-7a.5.5 0 0 1 0-1zm-2 1a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm2 3h7a.5.5 0 1 1 0 1h-7a.5.5 0 1 1 0-1zm-2 1a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zM0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13zm1 0v13a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5zM1 4V3h14v1H1z' />
    </svg>
);

IconStatement.propTypes = {
    className: PropTypes.string,
};

export default IconStatement;
