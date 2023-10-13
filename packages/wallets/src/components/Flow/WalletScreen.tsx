import React, { FC, Fragment, ReactElement, ReactNode, useEffect } from 'react';
import { useFlow } from './WalletFlowProvider';

type TScreenProps = {
    screenId: string;
    component: ReactNode;
};

const WalletScreen: FC<TScreenProps> = ({ screenId, component }) => {
    const { currentScreenId, registerScreen } = useFlow();

    useEffect(() => {
        registerScreen(screenId, component);
    }, []);

    if (currentScreenId !== screenId) return null;

    return <Fragment>{component}</Fragment>;
};

export default WalletScreen;
