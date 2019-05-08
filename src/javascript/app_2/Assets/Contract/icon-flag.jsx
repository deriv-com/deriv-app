import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { Icon }     from 'Assets/Common/icon.jsx';

export const IconFlagSVG = () => (
    <svg className='chart-spot__icon' width='16' height='16' viewBox='0 0 16 16'>
        <g fill='none' fillRule='evenodd'>
            <path d='M0 0h16v16H0z' />
            <path className='color1-fill' fill='#fff' fillRule='nonzero' d='M5.736 15.144c.082.377-.181.745-.588.821-.406.076-.802-.167-.885-.545L1.084.856c-.082-.377.181-.745.588-.821.406-.077.802.167.885.544l3.179 14.565zM13.136 1.235c-2.8.256-3.3-1.03-5.971-.993C5.638.264 4.12.638 3.364.917l1.897 8.692c.462-.153 1.14-.284 2.054-.22 1.213.083 1.667.897 4.38.708 1.952-.137 3.029-1.223 3.029-1.223l.873-8.548s-.544.734-2.461.91z' />
        </g>
    </svg>
);

const IconFlag = () => (
    <Icon icon={IconFlagSVG} />
);

IconFlag.propTypes = {
    color: PropTypes.string,
};

export default observer(IconFlag);
