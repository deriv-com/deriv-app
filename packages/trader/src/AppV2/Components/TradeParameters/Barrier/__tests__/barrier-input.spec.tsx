import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BarrierInput from '../barrier-input';
import userEvent from '@testing-library/user-event';
import TraderProviders from '../../../../../trader-providers';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import { TCoreStores } from '@deriv/stores/types';

describe('BarrierInput', () => {
    const setInitialBarrierValue = jest.fn();
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

    const mockBarrierInput = (mocked_store: TCoreStores) => {
        render(
            <TraderProviders store={mocked_store}>
                <ModulesProvider store={mocked_store}>
                    <BarrierInput isDays={false} setInitialBarrierValue={setInitialBarrierValue} onClose={onClose} />
                </ModulesProvider>
            </TraderProviders>
        );
    };

    it('renders BarrierInput component correctly', () => {
        mockBarrierInput(mockStore(default_trade_store));
        expect(screen.getByText('Above spot')).toBeInTheDocument();
        expect(screen.getByText('Below spot')).toBeInTheDocument();
        expect(screen.getByText('Fixed barrier')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Distance to spot')).toBeInTheDocument();
        expect(screen.getByText('Current spot')).toBeInTheDocument();
    });

    it('closes ActionSheet on pressing primary action when on first page', async () => {
        mockBarrierInput(mockStore(default_trade_store));
        userEvent.click(screen.getByRole('textbox'));
        userEvent.click(screen.getByText(/Save/));
        await waitFor(() => {
            expect(onClose).toBeCalledWith(true);
        });
    });

    it('calls setInitialBarrierValue and onChange on component mount', () => {
        mockBarrierInput(mockStore(default_trade_store));
        expect(setInitialBarrierValue).toHaveBeenCalledWith('+10');
    });

    it('handles chip selection correctly', () => {
        mockBarrierInput(mockStore(default_trade_store));
        const aboveSpotChip = screen.getByText('Above spot');
        const belowSpotChip = screen.getByText('Below spot');
        const fixedPriceChip = screen.getByText('Fixed barrier');

        userEvent.click(belowSpotChip);
        expect(onChange).toHaveBeenCalledWith({ target: { name: 'barrier_1', value: '-10' } });

        userEvent.click(fixedPriceChip);
        expect(onChange).toHaveBeenCalledWith({ target: { name: 'barrier_1', value: '' } });

        userEvent.click(aboveSpotChip);
        expect(onChange).toHaveBeenCalledWith({ target: { name: 'barrier_1', value: '+10' } });
    });

    it('handles input change correctly', () => {
        mockBarrierInput(mockStore(default_trade_store));
        const input = screen.getByPlaceholderText('Distance to spot');

        fireEvent.change(input, { target: { value: '20' } });
        expect(onChange).toHaveBeenCalledWith({ target: { name: 'barrier_1', value: '+20' } });

        const belowSpotChip = screen.getByText('Below spot');
        userEvent.click(belowSpotChip);
        fireEvent.change(input, { target: { value: '15' } });
        expect(onChange).toHaveBeenCalledWith({ target: { name: 'barrier_1', value: '-15' } });
    });

    it('sets initial barrier value and option correctly for a positive barrier', () => {
        mockBarrierInput(mockStore(default_trade_store));
        expect(setInitialBarrierValue).toHaveBeenCalledWith('+10');
        expect(screen.getAllByRole('button')[0]).toHaveAttribute('data-state', 'selected');
    });

    it('sets initial barrier value and option correctly for a negative barrier', () => {
        default_trade_store.modules.trade.barrier_1 = '-10';
        mockBarrierInput(mockStore(default_trade_store));
        expect(setInitialBarrierValue).toHaveBeenCalledWith('-10');
        expect(screen.getAllByRole('button')[1]).toHaveAttribute('data-state', 'selected');
    });

    it('sets initial barrier value and option correctly for a fixed price barrier', () => {
        default_trade_store.modules.trade.barrier_1 = '30';
        mockBarrierInput(mockStore(default_trade_store));
        expect(setInitialBarrierValue).toHaveBeenCalledWith('30');
        expect(screen.getAllByRole('button')[2]).toHaveAttribute('data-state', 'selected');
    });

    it('shows error when a validation error comes', () => {
        default_trade_store.modules.trade.validation_errors.barrier_1 = ['Something went wrong'] as never;
        mockBarrierInput(mockStore(default_trade_store));
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('shows error when a validation error comes for fixed price as well', () => {
        default_trade_store.modules.trade.validation_errors.barrier_1 = ['Something went wrong'] as never;
        default_trade_store.modules.trade.barrier_1 = '10';
        mockBarrierInput(mockStore(default_trade_store));
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('handles chip selection correctly for Above spot when initial barrier is negative', () => {
        default_trade_store.modules.trade.barrier_1 = '-10';
        mockBarrierInput(mockStore(default_trade_store));

        const aboveSpotChip = screen.getByText('Above spot');
        userEvent.click(aboveSpotChip);

        expect(onChange).toHaveBeenCalledWith({ target: { name: 'barrier_1', value: '+10' } });
    });

    it('handles chip selection correctly for Below spot when initial barrier is positive', () => {
        default_trade_store.modules.trade.barrier_1 = '+.6';
        mockBarrierInput(mockStore(default_trade_store));

        const belowSpotChip = screen.getByText('Below spot');
        userEvent.click(belowSpotChip);

        expect(onChange).toHaveBeenCalledWith({ target: { name: 'barrier_1', value: '-0.6' } });
    });

    it('handles chip selection correctly for Fixed barrier', () => {
        default_trade_store.modules.trade.barrier_1 = '+.6';
        mockBarrierInput(mockStore(default_trade_store));

        const fixedPriceChip = screen.getByText('Fixed barrier');
        userEvent.click(fixedPriceChip);

        expect(onChange).toHaveBeenCalledWith({ target: { name: 'barrier_1', value: '' } });
    });

    it('handles chip selection correctly for Above spot when initial barrier is fixed price', () => {
        default_trade_store.modules.trade.barrier_1 = '.6';
        mockBarrierInput(mockStore(default_trade_store));

        const aboveSpotChip = screen.getByText('Above spot');
        userEvent.click(aboveSpotChip);

        expect(onChange).toHaveBeenCalledWith({ target: { name: 'barrier_1', value: '+0.6' } });
    });
});
