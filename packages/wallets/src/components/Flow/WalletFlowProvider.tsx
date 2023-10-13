import React, {
    FC,
    createContext,
    useRef,
    ReactElement,
    useContext,
    useState,
    Children,
    ReactNode,
    ReactFragment,
    ReactPortal,
} from 'react';
import { Formik, FormikErrors, FormikValues } from 'formik';

type TFlowProviderContext = {
    currentScreenId: string;
    switchScreen: (screenId: string) => void;
    registerScreen: (screenId: string, component: ReactNode) => void;
    formValues: FormikValues;
    setFormValues: (
        field: string,
        value: any,
        shouldValidate?: boolean | undefined
    ) => Promise<void | FormikErrors<any>>;
};

type FlowChildren = ReactElement | ReactFragment | ReactPortal;

type TFlowProviderProps = {
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

    if (!currentScreenId) return null;

    const context = {
        currentScreenId,
        switchScreen,
        switchNextScreen,
        registerScreen,
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
