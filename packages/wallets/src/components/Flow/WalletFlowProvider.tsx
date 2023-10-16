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
    useEffect,
} from 'react';
import { Formik, FormikErrors, FormikValues } from 'formik';

export type TFlowProviderContext<T> = {
    currentScreenId: keyof T;
    switchScreen: (screenId: keyof T) => void;
    switchNextScreen: () => void;
    // registerScreen: (screenId: string, component: ReactNode) => void;
    formValues: FormikValues;
    setFormValues: (
        field: string,
        value: any,
        shouldValidate?: boolean | undefined
    ) => Promise<void | FormikErrors<any>>;
    WalletScreen?: ReactNode;
};

type FlowChildren = ReactElement | ReactFragment | ReactPortal;

export type TWalletScreens = {
    [id: string]: ReactNode;
};

export type TFlowProviderProps<T> = {
    currentScreenId: keyof T;
    initialScreenId: keyof T;
    initialValues: FormikValues;
    screens: T;
    children: (context: TFlowProviderContext<T>) => FlowChildren;
};

const FlowProviderContext = createContext<TFlowProviderContext<{}> | null>(null);

export const useFlow = () => {
    const flowProviderContext = useContext(FlowProviderContext);

    if (!flowProviderContext) throw new Error('useFlow must be used within a FlowProvider component.');

    return flowProviderContext;
};

function WalletFlowProvider<T extends TWalletScreens>({
    initialValues,
    initialScreenId,
    screens,
    children,
}: TFlowProviderProps<T>) {
    const [currentScreenId, setCurrentScreenId] = useState<keyof T>(initialScreenId);

    const screenIds = useRef<(keyof T)[]>([]);

    const switchScreen = (screenId: keyof T) => {
        setCurrentScreenId(screenId);
    };

    const switchNextScreen = () => {
        const currentScreenIndex = screenIds.current.indexOf(currentScreenId);
        console.log('swithing screen', currentScreenIndex);
        if (currentScreenIndex < screenIds.current.length) {
            const nextScreenId = screenIds.current[currentScreenIndex + 1];
            switchScreen(nextScreenId);
        }
    };

    useEffect(() => {
        screenIds.current = Object.keys(screens);
    }, []);

    const currentScreen = useMemo(() => {
        return screens[currentScreenId];
    }, [currentScreenId]);

    if (!currentScreenId) return null;

    const context = {
        currentScreenId,
        switchScreen,
        switchNextScreen,
        WalletScreen: currentScreen,
    };

    return (
        // We let the logic of the onSubmit be handled by the flow component
        <Formik initialValues={initialValues} onSubmit={() => {}}>
            {({ values, setFieldValue }) => {
                return (
                    <FlowProviderContext.Provider
                        value={
                            {
                                ...context,
                                formValues: values,
                                setFormValues: setFieldValue,
                            } as TFlowProviderContext<T>
                        }
                    >
                        {children({
                            ...context,
                            formValues: values,
                            setFormValues: setFieldValue,
                        } as TFlowProviderContext<T>)}
                    </FlowProviderContext.Provider>
                );
            }}
        </Formik>
    );
}

export default WalletFlowProvider;
