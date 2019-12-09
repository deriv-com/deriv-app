import PropTypes         from 'prop-types';
import React             from 'react';
import classNames        from 'classnames';

const IconPositions = ({ className }) => {
    const IconType = (
        <g fill='none' fillRule='evenodd'>
            <path className='color1-fill color3-fill' fill='#000' fillOpacity='.8' fillRule='evenodd' d='M5 2v-.5A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5V2h3.5A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2H5zm1 0h4v-.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V2zM1 8.128V12.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V8.128l-2.804 1.557a2.5 2.5 0 0 1-1.214.315H5.018a2.5 2.5 0 0 1-1.214-.315L1 8.128zm0-1.144L4.29 8.81A1.5 1.5 0 0 0 5.018 9h5.964a1.5 1.5 0 0 0 .728-.189L15 6.984V3.5a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5v3.484zM6.5 8a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3z' />
        </g>
    );

    return (
        <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
            {IconType}
        </svg>
    );
};

IconPositions.propTypes = {
    className: PropTypes.string,
    type     : PropTypes.string,
};

export default IconPositions;
