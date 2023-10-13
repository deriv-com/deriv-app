import React, { FC, createContext, ReactNode, useState, useContext, useMemo, useEffect } from 'react';

export type TFlowSwitcherProps = {
    initialFlowId?: string;
    flowConfig: TFlowConfig;
};

export type TFlowSwitcherContext = {
    currentFlowId: string;
    switchFlow: (flowId: string) => void;
    screens: TScreenRoute[];
};

export type TScreenRoute = {
    screenId: string;
    component: ReactNode;
};

export type TFlowRoute = {
    flowId: string;
    component: ReactNode;
    screens: TScreenRoute[];
};

export type TFlowConfig = TFlowRoute[];

const FlowSwitcherContext = createContext<TFlowSwitcherContext | null>(null);

export const useFlowSwitcher = () => {
    const flowContext = useContext(FlowSwitcherContext);

    if (!flowContext) throw new Error('useFlowSwitcher hook must be used within a FlowSwitcher component.');

    return flowContext;
};

const FlowSwitcher: FC<TFlowSwitcherProps> = ({ initialFlowId, flowConfig }) => {
    const [currentFlowId, setCurrentFlowId] = useState(initialFlowId);
    const switchFlow = (flowId: string) => {
        setCurrentFlowId(flowId);
    };

    const currentFlow = useMemo(() => {
        let flowIndex = 0;
        for (let i = 0; i < flowConfig.length; i++) {
            if (flowConfig[i].flowId === currentFlowId) {
                flowIndex = i;
                break;
            }
        }

        return flowConfig[flowIndex];
    }, [currentFlowId]);

    if (!currentFlowId) return null;

    return (
        <FlowSwitcherContext.Provider
            value={{
                currentFlowId,
                switchFlow,
                screens: currentFlow.screens,
            }}
        >
            {currentFlow.component}
        </FlowSwitcherContext.Provider>
    );
};

export default FlowSwitcher;
