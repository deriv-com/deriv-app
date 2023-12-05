import React from 'react';
import Icon from '../icon/icon';

type TArrowIndicatorProps = {
    classname?: string;
    has_increased?: boolean | null;
};

const ArrowIndicator = ({ classname, has_increased }: TArrowIndicatorProps) => {
    if (typeof has_increased !== 'boolean') return null;
    return <div className={classname}>{has_increased ? <Icon icon='IcProfit' /> : <Icon icon='IcLoss' />}</div>;
};

export default ArrowIndicator;
