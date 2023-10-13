import React, { FC, PropsWithChildren, createContext, ReactNode, useRef, useState, useContext } from 'react';

type TFlowSwitcherProps = {
    initialFlowId?: string;
};

type TFlowSwitcherContext = {
    currentFlowId: string;
    registerFlow: (flowId: string, component: ReactNode) => void;
    switchFlow: (flowId: string) => void;
};

const FlowSwitcherContext = createContext<TFlowSwitcherContext | null>(null);

export const useFlowSwitcher = () => {
    const flowContext = useContext(FlowSwitcherContext);

    if (!flowContext) throw new Error('useFlowSwitcher hook must be used within a FlowSwitcher component.');

    return flowContext;
};

const FlowSwitcher: FC<PropsWithChildren<TFlowSwitcherProps>> = ({ children, initialFlowId }) => {
    const [currentFlowId, setCurrentFlowId] = useState(initialFlowId);

    const flowRegistry = useRef<Record<string, ReactNode>>({});

    const switchFlow = (flowId: string) => {
        setCurrentFlowId(flowId);
    };

    const registerFlow = (flowId: string, component: ReactNode) => {
        flowRegistry.current[flowId] = component;
    };

    if (!currentFlowId) return null;

    return (
        <FlowSwitcherContext.Provider
            value={{
                currentFlowId,
                switchFlow,
                registerFlow,
            }}
        >
            {children}
        </FlowSwitcherContext.Provider>
    );
};

export default FlowSwitcher;
