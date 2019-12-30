import classNames         from 'classnames';
import { observer }       from 'mobx-react';
import PropTypes          from 'prop-types';
import React              from 'react';

const MarkerSpot = ({
    className,
}) => (
    <div className={classNames('chart-spot', className)} />
);

MarkerSpot.propTypes = {
    className: PropTypes.string,
};

export default observer(MarkerSpot);
