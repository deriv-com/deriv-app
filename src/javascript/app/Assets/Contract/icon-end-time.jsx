import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from 'Assets/Common/icon.jsx';

export const IconEndTimeSVG = ({ className, classNamePath }) => (
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' className={className}>
        <g fill='none' fillRule='evenodd'>
            <circle className={classNamePath} cx='12' cy='12' r='12' />
            <path
                fill='#FFF'
                fillRule='nonzero'
                d='M6.364 5.333h12.303c.736 0 1.333.597 1.333 1.334v8c0 .736-.597 1.333-1.333 1.333H6.364v3.333a.667.667 0 0 1-.667.667h-.03A.667.667 0 0 1 5 19.333V4.667C5 4.298 5.298 4 5.667 4h.03c.368 0 .667.298.667.667v.666zm4.09 1.334v2.666h2.728V6.667h-2.727zm2.728 2.666V12h2.727V9.333h-2.727zm2.727-2.666v2.666h2.727V6.667H15.91zm0 5.333v2.667h2.727V12H15.91zm-5.454 0v2.667h2.727V12h-2.727zM7.727 9.333V12h2.728V9.333H7.727z'
            />
        </g>
    </svg>
);

const IconEndTime = () => <Icon icon={IconEndTimeSVG} />;

IconEndTime.propTypes = {
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
    color        : PropTypes.string,
};

export default observer(IconEndTime);
