import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconPasswordShow = ({ className, classNamePath, onClick }) => (
    <svg className={ classNames('inline-icon', className) } width='16' height='16' onClick={ onClick }>
        <g id='outlined/action/visible' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
            <g id='ic-show-password'>
                <path id='Path' d='M0 0h16v16H0z' />
                <path
                    className={ classNames('color1-fill', classNamePath) }
                    d='M8 4c2.578 0 4.878 1.55 6 4-1.122 2.45-3.415 4-6 4s-4.878-1.55-6-4c1.122-2.45 3.422-4 6-4m0-1C4.667 3 1.82 5.073.667 8c1.153 2.927 4 5 7.333 5s6.18-2.073 7.333-5c-1.153-2.927-4-5-7.333-5zm0 3a2 2 0 11-.001 4.001A2 2 0 018 6m0-1C6.347 5 5 6.347 5 8s1.347 3 3 3 3-1.347 3-3-1.347-3-3-3z'
                    id='Shape'
                    fill='#333'
                    fillRule='nonzero'
                />
            </g>
        </g>
    </svg>
);

IconPasswordShow.propTypes = {
    className  : PropTypes.string,
    is_disabled: PropTypes.bool,
};

export default IconPasswordShow;

