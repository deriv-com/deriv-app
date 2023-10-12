import React from 'react';
import classNames from 'classnames';
import { Icon } from '@deriv/components';
import { getSnakeCase } from '@deriv/components/utils/helper';
import { useP2PPaymentMethods } from '@deriv/hooks';

type TPaymentMethodIconProps = {
    className?: string;
    display_name?: string;
    size?: number;
};

/**
 * @deprecated Should replace this component with `Icon` component when we start to use hooks and no longer depends on the store to get payment method information.
 */
const PaymentMethodIcon = ({ className, display_name, size }: TPaymentMethodIconProps) => {
    const { data: p2p_payment_methods } = useP2PPaymentMethods();

    const payment_method_icon = React.useMemo(() => {
        return p2p_payment_methods?.find(method => method.display_name === display_name)?.icon || '';
    }, [p2p_payment_methods, display_name]);

    return (
        <Icon
            className={classNames(className)}
            data_testid={`dt_${getSnakeCase(payment_method_icon)}`}
            icon={payment_method_icon}
            size={size}
        />
    );
};

export default PaymentMethodIcon;
