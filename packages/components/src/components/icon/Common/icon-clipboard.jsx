import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconClipboard = ({ className, onClick }) => (
    <svg
        width='14'
        height='16'
        xmlns='http://www.w3.org/2000/svg'
        className={classNames('inline-icon', className)}
        onClick={ onClick }
    >
        <path
            d='M13.467 0H3.05a.535.535 0 00-.533.536v1.845H.533A.535.535 0 000 2.917v12.547c0 .295.239.536.533.536H10.95c.294 0 .533-.24.533-.536v-1.845h1.984c.294 0 .533-.24.533-.536V.536A.535.535 0 0013.467 0zM.931 15.063V3.319h7.185v1.928c0 .283.229.514.51.514h1.925v9.301H.931zM9.047 3.979l.842.844h-.842v-.844zm4.022 8.702h-1.586v-7.36a.535.535 0 00-.157-.38L8.93 2.538a.528.528 0 00-.376-.157H3.449V.938h9.62V12.68z'
            fill='#999'
            fillRule='nonzero'
        />
    </svg>
);

IconClipboard.propTypes = {
    className: PropTypes.string,
};

export default IconClipboard;
