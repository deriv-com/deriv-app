import React from 'react';
import { Formik } from 'formik';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import DesktopFormWrapper from '../desktop-form-wrapper';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

jest.mock('../../../../../xml/martingale.xml', () => '');
jest.mock('../../../../../xml/martingale_max-stake.xml', () => '');

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
    utils: {
        xml: {
            textToDom: jest.fn(),
            domToText: jest.fn(),
        },
    },
    Xml: {
        domToText: jest.fn(),
    },
};

const onClickClose = jest.fn();

describe('<DesktopFormWrapper />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_dbot_store: RootStore | undefined;
    const mockOnSubmit = jest.fn(() =>
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
    );

    beforeEach(() => {
        const mock_store = mockStore({});
        mock_dbot_store = mockDBotStore(mock_store, mock_ws);
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

    it('renders the DesktopFormWrapper component', () => {
        const { container } = render(
            <DesktopFormWrapper onClickClose={onClickClose}>
                <div>test</div>
            </DesktopFormWrapper>,
            {
                wrapper,
            }
        );

        expect(container).toBeInTheDocument();
    });

    it('should close the form', () => {
        render(
            <DesktopFormWrapper onClickClose={onClickClose}>
                <div>test</div>
            </DesktopFormWrapper>,
            {
                wrapper,
            }
        );

        const close_button = screen.getByTestId('qs-desktop-close-button');
        userEvent.click(close_button);
        userEvent.type(close_button, '{enter}');
        userEvent.keyboard('{Enter}');
        expect(onClickClose).toBeCalled();
    });

    it('should submit the form', async () => {
        render(
            <DesktopFormWrapper onClickClose={onClickClose}>
                <div>
                    <textarea />
                </div>
            </DesktopFormWrapper>,
            {
                wrapper,
            }
        );
        const submit_button = screen.getByRole('button', { name: 'Add' });
        userEvent.click(submit_button);
        await waitFor(() => expect(mockOnSubmit).toBeCalled());
    });
});
