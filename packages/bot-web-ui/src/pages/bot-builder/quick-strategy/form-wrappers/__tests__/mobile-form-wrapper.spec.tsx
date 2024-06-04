import React from 'react';
import { Formik } from 'formik';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import MobileFromWrapper from '../mobile-form-wrapper';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.mock('../../../../../xml/martingale.xml', () => '');

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

window.Blockly = {
    Xml: {
        textToDom: jest.fn(),
        domToText: jest.fn(),
    },
};

describe('<MobileFormWrapper />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_onSubmit = jest.fn();

    beforeEach(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        const initial_value = {};
        mock_DBot_store?.quick_strategy.setFormVisibility(true);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <Formik initialValues={initial_value} onSubmit={mock_onSubmit}>
                        {children}
                    </Formik>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('renders the MobileFormWrapper component', () => {
        const { container } = render(
            <MobileFromWrapper>
                <div>test</div>
            </MobileFromWrapper>,
            {
                wrapper,
            }
        );

        expect(container).toBeInTheDocument();
    });

    it('should change the selected strategy', () => {
        mock_DBot_store?.quick_strategy.setSelectedStrategy('MARTINGALE');
        render(
            <MobileFromWrapper>
                <div>test</div>
            </MobileFromWrapper>,
            {
                wrapper,
            }
        );
        expect(mock_DBot_store?.quick_strategy.selected_strategy).toBe('MARTINGALE');
        userEvent.selectOptions(screen.getByRole('combobox'), ['D_ALEMBERT']);
        expect(mock_DBot_store?.quick_strategy.selected_strategy).toBe('D_ALEMBERT');
    });

    it('should submit the form', async () => {
        render(
            <MobileFromWrapper>
                <div>
                    <textarea />
                </div>
            </MobileFromWrapper>,
            {
                wrapper,
            }
        );
        expect(mock_DBot_store?.quick_strategy.is_open).toBeTruthy();
        const submit_button = screen.getByRole('button', { name: /Run/i });
        userEvent.click(submit_button);
        await waitFor(() => expect(mock_onSubmit).toBeCalled());
    });
});
