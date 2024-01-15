import React from 'react';
import Icon from '../icon/icon';

type TArrowIndicatorProps = {
    className?: string;
    value?: number | string;
};

type TData = {
    previous_icon: string;
    icon: string;
    previous_value?: string | number;
    value?: string | number;
};

const ArrowIndicator = ({ className, value }: TArrowIndicatorProps) => {
    const [is_visible, setIsVisible] = React.useState(false);
    const [data, setData] = React.useState<TData>({
        icon: '',
        previous_icon: '',
    });
    const { icon, previous_icon, previous_value } = data;
    const has_comparable_values = !isNaN(Number(data.value)) && !isNaN(Number(value));
    const timeout_id = React.useRef<ReturnType<typeof setTimeout>>();

    React.useEffect(() => {
        setIsVisible(true);
        setData(prev_data => {
            const has_increased = Number(prev_data.value) < Number(value);
            const icon_name = has_increased ? 'IcProfit' : 'IcLoss';
            return {
                icon: has_comparable_values ? icon_name : '',
                previous_icon: prev_data.icon,
                previous_value: prev_data.value,
                value,
            };
        });

        clearTimeout(timeout_id.current);
        timeout_id.current = setTimeout(() => {
            setIsVisible(false);
        }, 3000);
        return () => clearTimeout(timeout_id.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <div className={className} data-testid='dt_arrow_indicator'>
            {has_comparable_values && is_visible ? (
                <Icon icon={previous_value === Number(value) ? previous_icon : icon} />
            ) : null}
        </div>
    );
};

export default React.memo(ArrowIndicator);
