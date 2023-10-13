import React, { FC, Fragment, ReactNode, useEffect } from 'react';
import { useFlowSwitcher } from './WalletFlowSwitcher';

type TFlowProps = {
    flowId: string;
    component: ReactNode;
};

const WalletFlow: FC<TFlowProps> = ({ flowId, component }) => {
    const { currentFlowId, registerFlow } = useFlowSwitcher();

    useEffect(() => {
        registerFlow(flowId, component);
    }, []);

    if (currentFlowId !== flowId) return null;

    return <Fragment>{component}</Fragment>;
};

export default WalletFlow;
