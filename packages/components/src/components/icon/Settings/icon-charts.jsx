import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconCharts = ({ className }) => (
    <svg className={classNames('inline-icon', className)} xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
        <g fill='none' fillRule='evenodd'>
            <path
                fill='#000'
                fillOpacity='0.8'
                className='color1-fill'
                d='M2 14h14v1H2v1H1v-1H0v-1h1V0h1v14zm1.724-.83l-.895-.446L5.321 7.74 9.266 10.7l3.262-8.698 2.604 7.814-.948.316-1.712-5.134L9.734 12.3 5.679 9.26l-1.955 3.91z'
            />
        </g>
    </svg>
);

IconCharts.propTypes = {
    className: PropTypes.string,
};

export default IconCharts;
