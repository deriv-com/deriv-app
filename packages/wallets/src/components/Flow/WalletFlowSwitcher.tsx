import React, { FC, createContext, ReactNode, useState, useContext, useMemo, useEffect } from 'react';

export type TWalletFlows = {
    [id: string]: ReactNode;
};

export type TFlowSwitcherProps = {
    initialFlowId: string;
    flows: TWalletFlows;
};

export type TFlowSwitcherContext = {
    currentFlowId: string;
    switchFlow: (flowId: string) => void;
};

const FlowSwitcherContext = createContext<TFlowSwitcherContext | null>(null);

export const useFlowSwitcher = () => {
    const flowContext = useContext(FlowSwitcherContext);

    if (!flowContext) throw new Error('useFlowSwitcher hook must be used within a FlowSwitcher component.');

    return flowContext;
};

function FlowSwitcher({ initialFlowId, flows }: TFlowSwitcherProps) {
    const [currentFlowId, setCurrentFlowId] = useState(initialFlowId);

    const switchFlow = (flowId: string) => {
        setCurrentFlowId(flowId);
    };

    const currentFlow = useMemo(() => {
        return flows[currentFlowId];
    }, [currentFlowId]);

    if (!currentFlowId) return null;

    return (
        <FlowSwitcherContext.Provider
            value={{
                currentFlowId,
                switchFlow,
            }}
        >
            {currentFlow}
        </FlowSwitcherContext.Provider>
    );
}

export default FlowSwitcher;
