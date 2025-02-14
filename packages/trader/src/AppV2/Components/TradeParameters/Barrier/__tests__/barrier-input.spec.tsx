import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BarrierInput from '../barrier-input';
import userEvent from '@testing-library/user-event';
import TraderProviders from '../../../../../trader-providers';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import { TCoreStores } from '@deriv/stores/types';
import { useDtraderQuery } from 'AppV2/Hooks/useDtraderQuery';

jest.mock('AppV2/Hooks/useDtraderQuery', () => ({
    ...jest.requireActual('AppV2/Hooks/useDtraderQuery'),
    useDtraderQuery: jest.fn(),
}));

describe('BarrierInput', () => {
    let mockUseDtraderQuery: jest.Mock;

    beforeEach(() => {
        mockUseDtraderQuery = useDtraderQuery as jest.Mock;
        mockUseDtraderQuery.mockReset();
    });

    const onChange = jest.fn();
    const onClose = jest.fn();
    const default_trade_store = {
        modules: {
            trade: {
                barrier_1: '+10',
                onChange,
                validation_errors: { barrier_1: [] },
                duration: 10,
                proposal_info: { CALL: { id: '123', message: 'test_message', has_error: true, spot: 12345 } },
            },
        },
    };
    const mockBarrierInput = (mocked_store: TCoreStores, is_open = true) => {
        render(
            <TraderProviders store={mocked_store}>
                <ModulesProvider store={mocked_store}>
                    <BarrierInput is_days={false} onClose={onClose} is_open={is_open} />
                </ModulesProvider>
            </TraderProviders>
        );
    };

    it('renders BarrierInput component correctly', () => {
        mockUseDtraderQuery.mockReturnValue({
            data: {
                proposal: { barrier: +10 },
                echo_req: { contract_type: 'TURBOSSHORT', authorized: true },
                error: {},
            },
        });

        mockBarrierInput(mockStore(default_trade_store));
        expect(screen.getByText('Above spot')).toBeInTheDocument();
        expect(screen.getByText('Below spot')).toBeInTheDocument();
        expect(screen.getByText('Fixed barrier')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Distance to spot')).toBeInTheDocument();
        expect(screen.getByText('Current spot')).toBeInTheDocument();
    });

    it('closes ActionSheet on pressing primary action when on first page', async () => {
        mockUseDtraderQuery.mockReturnValue({
            data: {
                proposal: { barrier: +10 },
                echo_req: { contract_type: 'TURBOSSHORT', authorized: true },
                error: {},
            },
        });
        mockBarrierInput(mockStore(default_trade_store), false);
        await userEvent.click(screen.getByRole('textbox'));
        await userEvent.click(screen.getByText(/Save/));
        await waitFor(() => {
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('handles input change correctly', async () => {
        mockUseDtraderQuery.mockReturnValue({
            data: {
                proposal: { barrier: -101 },
                echo_req: { contract_type: 'TURBOSSHORT', authorized: true },
                error: {},
            },
        });
        mockBarrierInput(mockStore(default_trade_store));
        const input = screen.getByPlaceholderText('Distance to spot');
        fireEvent.change(input, { target: { value: '10' } });
        const inputElement = screen.getByPlaceholderText('Distance to spot');
        expect(inputElement).toHaveValue('10');
    });

    it('shows error when a validation error comes', () => {
        mockUseDtraderQuery.mockReturnValue({
            data: {
                proposal: { barrier: -0.6 },
                echo_req: { contract_type: 'TURBOSSHORT', authorized: true },
                error: {
                    message: 'Barrier is out of acceptable range.',
                },
            },
        });
        mockBarrierInput(mockStore(default_trade_store));
        expect(screen.getByText('Barrier is out of acceptable range.')).toBeInTheDocument();
    });

    it('show value correctly for Below spot', async () => {
        mockUseDtraderQuery.mockReturnValue({
            data: {
                proposal: { barrier: -0.6 },
                echo_req: { contract_type: 'TURBOSSHORT', authorized: true },
                error: {},
            },
        });
        default_trade_store.modules.trade.barrier_1 = '-0.6';
        mockBarrierInput(mockStore(default_trade_store));

        const inputElement = screen.getByPlaceholderText('Distance to spot');
        expect(inputElement).toHaveValue('0.6');
    });

    it('show value correctly for above spot', async () => {
        mockUseDtraderQuery.mockReturnValue({
            data: {
                proposal: { barrier: +0.6 },
                echo_req: { contract_type: 'TURBOSSHORT', authorized: true },
                error: {},
            },
        });
        default_trade_store.modules.trade.barrier_1 = '+0.6';
        mockBarrierInput(mockStore(default_trade_store));

        const inputElement = screen.getByPlaceholderText('Distance to spot');
        expect(inputElement).toHaveValue('0.6');
    });

    it('show value correctly when initial barrier is fixed price', async () => {
        default_trade_store.modules.trade.barrier_1 = '60';
        mockUseDtraderQuery.mockReturnValue({
            data: {
                proposal: { barrier: 60 },
                echo_req: { contract_type: 'TURBOSSHORT', authorized: true },
                error: {},
            },
        });
        mockBarrierInput(mockStore(default_trade_store));

        const inputElement = screen.getByPlaceholderText('Price');
        expect(inputElement).toHaveValue('60');
    });
});
