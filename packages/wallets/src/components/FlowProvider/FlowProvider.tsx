import React, {
    createContext,
    ReactElement,
    ReactFragment,
    ReactNode,
    ReactPortal,
    useContext,
    useMemo,
    useState,
} from 'react';
import { Formik, FormikErrors, FormikValues } from 'formik';

export type TFlowProviderContext<T> = {
    WalletScreen?: ReactNode;
    currentScreenId: keyof T;
    formValues: FormikValues;
    setFormValues: (
        field: string,
        value: unknown,
        shouldValidate?: boolean | undefined
    ) => Promise<FormikErrors<unknown> | void>;
    switchNextScreen: () => void;
    switchScreen: (screenId: keyof T) => void;
};

type FlowChildren = ReactElement | ReactFragment | ReactPortal;

export type TWalletScreens = {
    [id: string]: ReactNode;
};

export type TFlowProviderProps<T> = {
    children: (context: TFlowProviderContext<T>) => FlowChildren;
    initialValues: FormikValues;
    screens: T;
    screensOrder: (keyof T)[];
};

const FlowProviderContext = createContext<TFlowProviderContext<TWalletScreens> | null>(null);

/**
 * Hook to use the flow provider's context.
 *
 * @returns {TFlowProviderContext} The flow provider's context:
 * - `currentScreenId`: The current screen's ID being shown
 * - `switchScreen`: Function which switches the current screen to another screen by their ID
 * - `switchNextScreen`: Function which switches to the next screen by default. If the current screen is the final screen, it will not do anything.
 * - `formValues`: The saved form values stored in Formik. By default it will contain the initial values passed in `initialValues` prop in the provider.
 * - `setFormValues`: Function which allows persistence for a form value, which can be used to persist the form values for a previous screen or for the next screen.
 * - `WalletScreen`: The rendered screen which is rendered by the FlowProvider.
 */
export const useFlow = () => {
    const flowProviderContext = useContext(FlowProviderContext);

    if (!flowProviderContext) throw new Error('useFlow must be used within a FlowProvider component.');

    return flowProviderContext;
};

/**
 * The FlowProvider is responsible for:
 * - Grouping screens together into a flow
 * - Managing screen routing through its context `switchScreen` and `switchNextScreen`
 * - Ensuring screen order is maintained through the `screensOrder` prop
 * - Persisting form values in screens through `setFormValues` and restoring them through `formValues`
 */
function FlowProvider<T extends TWalletScreens>({
    children,
    initialValues,
    screens,
    screensOrder,
}: TFlowProviderProps<T>) {
    const [currentScreenId, setCurrentScreenId] = useState<keyof T>(screensOrder[0]);
    const switchScreen = (screenId: keyof T) => {
        setCurrentScreenId(screenId);
    };

    const FlowProvider = FlowProviderContext.Provider as React.Provider<TFlowProviderContext<T> | null>;
    const currentScreenIndex = useMemo(() => screensOrder.indexOf(currentScreenId), [currentScreenId, screensOrder]);
    const isFinalScreen = currentScreenIndex >= screensOrder.length - 1;

    const switchNextScreen = () => {
        if (!isFinalScreen) {
            const nextScreenId = screensOrder[currentScreenIndex + 1];
            switchScreen(nextScreenId);
        }
    };

    const currentScreen = useMemo(() => {
        return screens[currentScreenId];
    }, [currentScreenId, screens]);

    if (!currentScreenId) return null;

    const context = {
        currentScreenId,
        switchNextScreen,
        switchScreen,
        WalletScreen: currentScreen,
    };

    return (
        // We let the logic of the onSubmit be handled by the flow component
        <Formik initialValues={initialValues} onSubmit={() => undefined}>
            {({ setFieldValue, values }) => {
                return (
                    <FlowProvider
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
                    </FlowProvider>
                );
            }}
        </Formik>
    );
}

export default FlowProvider;
