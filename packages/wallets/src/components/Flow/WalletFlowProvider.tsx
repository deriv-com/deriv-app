import React, {
    FC,
    createContext,
    useRef,
    ReactElement,
    useContext,
    useState,
    useMemo,
    ReactNode,
    ReactFragment,
    ReactPortal,
} from 'react';
import { Formik, FormikErrors, FormikValues } from 'formik';
import { useFlowSwitcher } from './WalletFlowSwitcher';

export type TFlowProviderContext = {
    currentScreenId: string;
    switchScreen: (screenId: string) => void;
    switchNextScreen: () => void;
    registerScreen: (screenId: string, component: ReactNode) => void;
    formValues: FormikValues;
    setFormValues: (
        field: string,
        value: any,
        shouldValidate?: boolean | undefined
    ) => Promise<void | FormikErrors<any>>;
    WalletScreen: ReactNode;
};

type FlowChildren = ReactElement | ReactFragment | ReactPortal;

export type TFlowProviderProps = {
    initialScreenId?: string;
    initialValues: FormikValues;
    children: (context: TFlowProviderContext) => FlowChildren;
};

const FlowProviderContext = createContext<TFlowProviderContext | null>(null);

export const useFlow = () => {
    const flowProviderContext = useContext(FlowProviderContext);

    if (!flowProviderContext) throw new Error('useFlow must be used within a FlowProvider component.');

    return flowProviderContext;
};

function WalletFlowProvider({ initialValues, initialScreenId, children }: TFlowProviderProps) {
    const [currentScreenId, setCurrentScreenId] = useState(initialScreenId);
    const { screens } = useFlowSwitcher();

    const screenRegistry = useRef<Record<string, ReactNode>>({});
    const screenIds = useRef<string[]>([]);

    const switchScreen = (screenId: string) => {
        setCurrentScreenId(screenId);
    };

    const switchNextScreen = () => {
        const currentScreenIndex = screenIds.current.indexOf(currentScreenId || '');
        if (currentScreenIndex < screenIds.current.length) {
            const nextScreenId = screenIds.current[currentScreenIndex + 1];
            switchScreen(nextScreenId);
        }
    };

    const registerScreen = (screenId: string, component: ReactNode) => {
        screenRegistry.current[screenId] = component;
        screenIds.current.push(screenId);
    };

    const currentScreen = useMemo(() => {
        let screenIndex = 0;
        for (let i = 0; i < screens.length; i++) {
            if (screens[i].screenId === currentScreenId) {
                screenIndex = i;
                break;
            }
        }

        return screens[screenIndex];
    }, [currentScreenId]);

    if (!currentScreenId) return null;

    const context = {
        currentScreenId,
        switchScreen,
        switchNextScreen,
        registerScreen,
        WalletScreen: currentScreen.component,
    };

    return (
        // We let the logic of the onSubmit be handled by the flow component
        <Formik initialValues={initialValues} onSubmit={() => {}}>
            {({ values, setFieldValue }) => {
                return (
                    <FlowProviderContext.Provider
                        value={{
                            ...context,
                            formValues: values,
                            setFormValues: setFieldValue,
                        }}
                    >
                        {children({
                            ...context,
                            formValues: values,
                            setFormValues: setFieldValue,
                        })}
                    </FlowProviderContext.Provider>
                );
            }}
        </Formik>
    );
}

export default WalletFlowProvider;
