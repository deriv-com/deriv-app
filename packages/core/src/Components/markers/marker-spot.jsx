import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import React from 'react';

const MarkerSpot = ({ className, spot_count }) => (
    <div className={classNames('chart-spot', className)}>{spot_count}</div>
);

MarkerSpot.propTypes = {
    className: PropTypes.string,
    spot_count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default observer(MarkerSpot);
