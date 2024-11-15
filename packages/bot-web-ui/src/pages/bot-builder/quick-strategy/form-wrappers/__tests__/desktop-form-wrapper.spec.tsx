import React from 'react';
import { Formik } from 'formik';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import DesktopFormWrapper from '../desktop-form-wrapper';
import { FORM_TABS, STRATEGIES } from '../../config';
import { quick_strategy_content } from '../../../../tutorials/constants';

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
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_onSubmit = jest.fn(() =>
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

    it('renders the DesktopFormWrapper component', () => {
        const { container } = render(
            <DesktopFormWrapper
                onClickClose={onClickClose}
                current_step={0}
                setCurrentStep={jest.fn()}
                selected_trade_type='trade_type'
                setSelectedTradeType={jest.fn()}
            >
                <div>test</div>
            </DesktopFormWrapper>,
            {
                wrapper,
            }
        );

        expect(container).toBeInTheDocument();
    });

    it('should close the form', async () => {
        render(
            <DesktopFormWrapper
                onClickClose={onClickClose}
                current_step={0}
                setCurrentStep={jest.fn()}
                selected_trade_type='trade_type'
                setSelectedTradeType={jest.fn()}
            >
                <div>test</div>
            </DesktopFormWrapper>,
            {
                wrapper,
            }
        );
        expect(mock_DBot_store?.quick_strategy.is_open).toBeTruthy();

        const close_button = screen.getByTestId('qs-desktop-close-button');
        await userEvent.click(close_button);
        await userEvent.type(close_button, '{enter}');
        await userEvent.keyboard('{Enter}');
        expect(onClickClose).toBeCalled();
    });

    it('should change the selected strategy', async () => {
        mock_DBot_store?.quick_strategy.setSelectedStrategy(quick_strategy_content[0].qs_name);
        render(
            <DesktopFormWrapper
                onClickClose={onClickClose}
                current_step={1}
                setCurrentStep={jest.fn()}
                selected_trade_type='trade_type'
                setSelectedTradeType={jest.fn()}
            >
                <div>test</div>
            </DesktopFormWrapper>,
            {
                wrapper,
            }
        );
        expect(mock_DBot_store?.quick_strategy.selected_strategy).toBe(quick_strategy_content[0].qs_name);

        const strategy = screen.getByText(STRATEGIES.MARTINGALE.label);
        await userEvent.click(strategy);

        const run_button = screen.getByText('Run');
        expect(run_button).toBeInTheDocument();
    });

    it('should submit the form on edit', async () => {
        render(
            <DesktopFormWrapper
                onClickClose={onClickClose}
                current_step={1}
                setCurrentStep={jest.fn()}
                selected_trade_type='trade_type'
                setSelectedTradeType={jest.fn()}
            >
                <div>test</div>
            </DesktopFormWrapper>,
            {
                wrapper,
            }
        );
        expect(mock_DBot_store?.quick_strategy.is_open).toBeTruthy();
        const edit_button = screen.getByText('Load');
        await userEvent.click(edit_button);
        await waitFor(() => expect(mock_onSubmit).toBeCalled());
    });

    it('should submit the form', async () => {
        render(
            <DesktopFormWrapper
                onClickClose={onClickClose}
                current_step={1}
                setCurrentStep={jest.fn()}
                selected_trade_type='trade_type'
                setSelectedTradeType={jest.fn()}
            >
                <div>
                    <textarea />
                </div>
            </DesktopFormWrapper>,
            {
                wrapper,
            }
        );
        expect(mock_DBot_store?.quick_strategy.is_open).toBeTruthy();
        const submit_button = screen.getByRole('button', { name: 'Run' });
        await userEvent.click(submit_button);
        await waitFor(() => expect(mock_onSubmit).toBeCalled());
    });
});
