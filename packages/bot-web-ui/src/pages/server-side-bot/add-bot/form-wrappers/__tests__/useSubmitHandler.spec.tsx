import React from 'react';
import { Formik } from 'formik';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import useSubmitHandler from '../useSubmitHandler';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

window.Blockly = {
    Xml: {
        textToDom: jest.fn(),
        domToText: jest.fn(),
    },
    derivWorkspace: {
        getAllBlocks: jest.fn(() => ({
            find: jest.fn(),
        })),
    },
};

jest.mock('formik', () => ({
    ...jest.requireActual('formik'),
    useFormikContext: () => ({
        setFieldValue: jest.fn(),
        submitForm: jest.fn(() =>
            Promise.resolve({
                symbol: '1HZ100V',
                durationtype: 't',
                stake: '1',
                loss: '1',
                profit: '1',
                size: '1',
                duration: 1,
                unit: '1',
                max_stake: 10,
                boolean_max_stake: false,
                last_digit_prediction: 1,
                tradetype: 'callput',
                type: 'CALL',
            })
        ),
        validateForm: jest.fn(),
        isValid: true,
    }),
}));

jest.mock('@deriv/bot-skeleton', () => ({
    ...jest.requireActual('@deriv/bot-skeleton'),
    ApiHelpers: {
        instance: {
            contracts_for: {
                getDurations: jest.fn(),
                getMarketBySymbol: jest.fn(),
                getSubmarketBySymbol: jest.fn(),
                getTradeTypeCategoryByTradeType: jest.fn(),
            },
        },
    },
}));

jest.mock('../../../../../xml/martingale_max-stake.xml', () => '');

describe('useSubmitHandler hook', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_dbot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeEach(() => {
        mock_dbot_store = mockDBotStore(mock_store, mock_ws);
        mock_dbot_store = {
            ...mock_dbot_store,
            server_bot: {
                ...mock_dbot_store.server_bot,
                setLossThresholdWarningData: jest.fn(),
            },
        };
        const mockOnSubmit = jest.fn();
        const initial_value = {};

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_dbot_store}>
                    <Formik initialValues={initial_value} onSubmit={mockOnSubmit}>
                        {children}
                    </Formik>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should call useSubmitHandler hook', async () => {
        mock_store.client.is_logged_in = true;
        const { result } = renderHook(() => useSubmitHandler(), { wrapper });
        result.current.handleSubmit();

        const { handleSubmit, proceedFormSubmission } = result.current;

        expect(typeof handleSubmit).toBe('function');
        expect(typeof proceedFormSubmission).toBe('function');
    });

    it('useSubmitHandler hook should not call setLossThresholdWarningData() when is_logged_in equals false', () => {
        mock_store.client.is_logged_in = false;
        const { result } = renderHook(() => useSubmitHandler(), { wrapper });
        result.current.handleSubmit();

        expect(mock_dbot_store?.server_bot.setLossThresholdWarningData).not.toHaveBeenCalled();
    });

    it('useSubmitHandler hook should not call setLossThresholdWarningData() when bot is running handle toggleStopBotDialog() and make it false', () => {
        mock_dbot_store?.run_panel?.setIsRunning(true);
        mock_store.client.is_logged_in = false;
        const { result } = renderHook(() => useSubmitHandler(), { wrapper });
        result.current.handleSubmit();

        expect(mock_dbot_store?.server_bot.setLossThresholdWarningData).not.toHaveBeenCalled();
    });

    it('useSubmitHandler hook should not call setLossThresholdWarningData() when the balance not less than loss and loss not bigger than profit', () => {
        mock_store.client.balance = undefined;

        const { result } = renderHook(() => useSubmitHandler(), { wrapper });
        result.current.handleSubmit();

        expect(mock_dbot_store?.server_bot.setLossThresholdWarningData).not.toHaveBeenCalled();
    });

    it('useSubmitHandler hook should not call setLossThresholdWarningData() when the balance more than loss and loss not bigger than profit', () => {
        mock_store.client.balance = 100000000;

        const { result } = renderHook(() => useSubmitHandler(), { wrapper });
        result.current.handleSubmit();

        expect(mock_dbot_store?.server_bot.setLossThresholdWarningData).not.toHaveBeenCalled();
    });

    it('useSubmitHandler hook should call setLossThresholdWarningData() when is_logged_in equals true and balance is less than loss', () => {
        mock_store.client.is_logged_in = true;
        mock_store.client.balance = -1;

        const { result } = renderHook(() => useSubmitHandler(), { wrapper });
        result.current.handleSubmit();

        expect(mock_dbot_store?.server_bot.setLossThresholdWarningData).toHaveBeenCalled();
    });
});
