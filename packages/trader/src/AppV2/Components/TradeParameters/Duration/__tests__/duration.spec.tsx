import React from 'react';
import { render, screen } from '@testing-library/react';
import Duration from '../index';
import TraderProviders from '../../../../../trader-providers';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import userEvent from '@testing-library/user-event';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

global.ResizeObserver = ResizeObserver;

describe('Duration', () => {
    let default_trade_store: TCoreStores;

    beforeEach(() => {
        default_trade_store = mockStore({
            modules: {
                trade: {
                    onChange: jest.fn(),
                    validation_errors: { barrier_1: [] },
                    duration: 30,
                    duration_unit: 'm',
                    expiry_type: 'duration',
                },
            },
        });
    });

    const mockDuration = () => {
        render(
            <TraderProviders store={default_trade_store}>
                <Duration />
            </TraderProviders>
        );
    };

    it('should render the Duration component with default values', () => {
        mockDuration();
        expect(screen.getByLabelText('Duration')).toBeInTheDocument();
        expect(screen.getByDisplayValue('30 minutes')).toBeInTheDocument();
    });

    it('should render the correct value for duration in hours and minutes', () => {
        default_trade_store.modules.trade.duration = 125;
        mockDuration();
        expect(screen.getByLabelText('Duration')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2 hours 5 minutes')).toBeInTheDocument();
    });

    it('should render the correct value for duration in days', () => {
        default_trade_store.modules.trade.duration = 6;
        default_trade_store.modules.trade.duration_unit = 'd';
        const mockDate = new Date(2024, 0, 1);
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

        mockDuration();
        expect(screen.getByLabelText('Duration')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Ends on 7 Jan 2024, 23:59:59 GMT')).toBeInTheDocument();
    });

    it('should render the correct value for duration in end time', () => {
        default_trade_store.modules.trade.duration = 1;
        default_trade_store.modules.trade.expiry_time = '23:55';
        default_trade_store.modules.trade.expiry_type = 'endtime';

        const mockDate = new Date(2024, 0, 1);
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

        mockDuration();
        expect(screen.getByLabelText('Duration')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Ends on 7 Jan 2024 23:55 GMT')).toBeInTheDocument();
    });

    it('should open the ActionSheet when the text field is clicked', () => {
        default_trade_store.modules.trade.expiry_time = '12:30';
        mockDuration();
        const textField = screen.getByLabelText('Duration');
        expect(textField).toBeInTheDocument();
        userEvent.click(textField);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
});
