import { createContext, useContext } from 'react';

type TCashierScrollContext = {
    onCashierScroll: React.UIEventHandler<HTMLDivElement> | null;
    setOnCashierScroll: React.Dispatch<React.UIEventHandler<HTMLDivElement> | null>;
};

export const CashierScrollContext = createContext<TCashierScrollContext | null>(null);

export const useCashierScroll = () => {
    const context = useContext(CashierScrollContext);

    if (!context) {
        throw new Error("Seems you didn't wrap your components in <CashierScrollContext.Provider />");
    }

    return context;
};
