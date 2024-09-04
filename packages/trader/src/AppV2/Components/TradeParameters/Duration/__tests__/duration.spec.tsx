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
    const default_trade_store = mockStore({
        modules: {
            trade: {
                onChange: jest.fn(),
                validation_errors: { barrier_1: [] },
                duration: 10,
                duration_unit: 'm',
                expiry_type: 'duration',
            },
        },
    });

    const mockDuration = (mocked_store: TCoreStores) => {
        render(
            <TraderProviders store={mocked_store}>
                <Duration />
            </TraderProviders>
        );
    };

    it('should render the Duration component with default values', () => {
        default_trade_store.modules.trade.duration = 30;

        mockDuration(default_trade_store);
        expect(screen.getByLabelText('Duration')).toBeInTheDocument();
        expect(screen.getByDisplayValue('30 minutes')).toBeInTheDocument();
    });

    it('should render the correct value for duration in hours and minutes', () => {
        default_trade_store.modules.trade.duration = 125;
        mockDuration(default_trade_store);
        expect(screen.getByLabelText('Duration')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2 hours 5 minutes')).toBeInTheDocument();
    });

    it('should open the ActionSheet when the text field is clicked', () => {
        default_trade_store.modules.trade.duration = 30;
        default_trade_store.modules.trade.expiry_time = '12:30';
        mockDuration(default_trade_store);
        const textField = screen.getByLabelText('Duration');
        expect(textField).toBeInTheDocument();
        userEvent.click(textField);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should display expiry time in GMT when expiry_type is "time"', () => {
        default_trade_store.modules.trade.duration = 30;
        default_trade_store.modules.trade.expiry_type = 'end time';
        default_trade_store.modules.trade.expiry_time = '12:30';
        mockDuration(default_trade_store);
        expect(screen.getByDisplayValue('Ends at 12:30 GMT')).toBeInTheDocument();
    });
});
