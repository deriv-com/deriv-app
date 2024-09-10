import React from 'react';
import { Formik } from 'formik';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import { SERVER_BOT_LOSS_THRESHOLD_WARNING } from '../../constants';
import LossThresholdWarningDialog from '../loss-threshold-warning-dialog';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

window.Blockly = {
    Xml: {
        textToDom: jest.fn(),
        domToText: jest.fn(),
    },
};

describe('LossThresholdWarningDialog', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_dbot_store: RootStore | undefined;

    beforeEach(() => {
        const mock_store = mockStore({
            ui: {
                is_mobile: true,
            },
        });
        mock_dbot_store = mockDBotStore(mock_store, mock_ws);
        const mockOnSubmit = jest.fn();
        const initial_value = {
            durationtype: 1,
            symbol: 'R_100',
            tradetype: 'callput',
        };

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
    it('should render LossThresholdWarningDialog', () => {
        const { container } = render(<LossThresholdWarningDialog />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should handle edit the amount button click', () => {
        mock_dbot_store?.server_bot.setLossThresholdWarningData({
            show: true,
        });
        render(<LossThresholdWarningDialog />, {
            wrapper,
        });
        const edit_amount_btn = screen.getByRole('button', { name: /Edit the amount/i });
        userEvent.click(edit_amount_btn);
        expect(mock_dbot_store?.server_bot.loss_threshold_warning_data.show).toBeFalsy();
    });

    it('should handle continue button click', async () => {
        mock_dbot_store?.server_bot.setLossThresholdWarningData({
            show: true,
        });
        render(<LossThresholdWarningDialog />, {
            wrapper,
        });
        const continue_btn = screen.getByRole('button', { name: /Yes, continue/i });
        userEvent.click(continue_btn);
        await waitFor(() => {
            expect(mock_dbot_store?.server_bot.loss_threshold_warning_data.show).toBeFalsy();
        });
    });

    it('should handle dont show again checkbox click', () => {
        mock_dbot_store?.server_bot.setLossThresholdWarningData({
            show: true,
        });
        render(<LossThresholdWarningDialog />, {
            wrapper,
        });
        const checkbox = screen.getByRole('checkbox', { name: /Do not show this message again./i });
        userEvent.click(checkbox);
        expect(localStorage.getItem(SERVER_BOT_LOSS_THRESHOLD_WARNING)).toEqual('true');
    });
});
