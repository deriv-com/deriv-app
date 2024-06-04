import { createContext, useContext } from 'react';

type TDynamicLeverageContext = {
    isDynamicLeverageVisible: boolean;
    toggleDynamicLeverage: () => void;
};

const DynamicLeverageContext = createContext<TDynamicLeverageContext>({
    isDynamicLeverageVisible: false,
    toggleDynamicLeverage: () => null,
});

export const useDynamicLeverageModalState = () => {
    const context = useContext(DynamicLeverageContext);

    if (!context)
        throw new Error(
            'useDynamicLeverageModalState() must be called within a component wrapped in DynamicLeverageProvider.'
        );

    return context;
};

export default DynamicLeverageContext;
