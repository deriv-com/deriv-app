import React from 'react';
import Icon from '../icon/icon';
import { usePrevious } from '../../hooks';

type TArrowIndicatorProps = {
    classname?: string;
    value?: number | string;
};

const ArrowIndicator = ({ classname, value }: TArrowIndicatorProps) => {
    const [is_hidden, setHidden] = React.useState(true);
    React.useEffect(() => {
        setHidden(false);
        const timeout_id = setTimeout(() => {
            setHidden(true);
        }, 3000);
        return () => clearTimeout(timeout_id);
    }, [value]);
    const current_value = Number(value);
    const previous_value = Number(usePrevious(value));
    const has_defined_values = !isNaN(previous_value) && !isNaN(current_value);
    const has_increased = has_defined_values && previous_value < current_value;
    const is_unchanged = previous_value === current_value;
    if (!has_defined_values || is_hidden || is_unchanged) return null;
    return <div className={classname}>{has_increased ? <Icon icon='IcProfit' /> : <Icon icon='IcLoss' />}</div>;
};

export default React.memo(ArrowIndicator);
