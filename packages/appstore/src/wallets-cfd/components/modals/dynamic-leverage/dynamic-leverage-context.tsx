import React, { useContext } from 'react';

type TDynamicLeverageContext = {
    is_dynamic_leverage_visible: boolean;
    toggleDynamicLeverage: React.MouseEventHandler<HTMLSpanElement>;
};

export const DynamicLeverageContext = React.createContext<TDynamicLeverageContext>({
    is_dynamic_leverage_visible: false,
    toggleDynamicLeverage: () => null,
});

export const useDynamicLeverage = () => {
    const dynamic_leverage = useContext(DynamicLeverageContext);
    return dynamic_leverage;
};
