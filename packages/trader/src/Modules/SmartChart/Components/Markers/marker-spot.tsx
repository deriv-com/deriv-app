import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';

type MarkerSpotProps = {
    className: string;
    spot_count: unknown | number | string;
};

const MarkerSpot = ({ className, spot_count }: MarkerSpotProps) => (
    <div className={classNames('chart-spot', className)}>{spot_count}</div>
);

export default observer(MarkerSpot);
