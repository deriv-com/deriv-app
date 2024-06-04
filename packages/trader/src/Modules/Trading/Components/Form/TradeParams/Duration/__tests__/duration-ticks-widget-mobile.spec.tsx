import React from 'react';
import { screen, render } from '@testing-library/react';
import TraderProviders from '../../../../../../../trader-providers';
import DurationTicksWidgetMobile from '../duration-ticks-widget-mobile';
import { mockStore } from '@deriv/stores';
import userEvent from '@testing-library/user-event';

describe('<DurationTicksWidgetMobile />', () => {
    let mock_store: ReturnType<typeof mockStore>, default_props: React.ComponentProps<typeof DurationTicksWidgetMobile>;
    beforeEach(() => {
        mock_store = {
            ...mockStore({
                modules: {
                    trade: {
                        amount: 123,
                        basis: 'stake',
                        duration: 5,
                        duration_unit: 't',
                        duration_min_max: {
                            daily: {
                                min: 1234,
                                max: 2345,
                            },
                            intraday: {
                                min: 12345,
                                max: 23456,
                            },
                            tick: {
                                min: 1,
                                max: 10,
                            },
                        },
                        onChangeMultiple: jest.fn(),
                    },
                },
            }),
        };
        default_props = {
            setDurationError: jest.fn(),
            basis_option: 'payout',
            toggleModal: jest.fn(),
            has_amount_error: false,
            payout_value: 10,
            stake_value: 10,
            selected_duration: 5,
            setSelectedDuration: jest.fn(),
        };
    });
    const renderDurationTicksWidgetMobile = (
        mock_store: ReturnType<typeof mockStore>,
        default_props: React.ComponentProps<typeof DurationTicksWidgetMobile>
    ) => {
        return render(
            <TraderProviders store={mock_store}>
                <DurationTicksWidgetMobile {...default_props} />
            </TraderProviders>
        );
    };
    it('Should call setDurationError on mount', () => {
        renderDurationTicksWidgetMobile(mock_store, default_props);
        expect(default_props.setDurationError).toHaveBeenCalled();
    });
    it('Should call onChangeMultiple and toggleModal when setTicksDuration is invoked', () => {
        renderDurationTicksWidgetMobile(mock_store, default_props);
        const ok_button = screen.getByText('OK');
        userEvent.click(ok_button);

        expect(mock_store.modules.trade.onChangeMultiple).toHaveBeenCalled();
        expect(default_props.toggleModal).toHaveBeenCalled();
    });
    it('should render items on screen', () => {
        renderDurationTicksWidgetMobile(mock_store, default_props);
        expect(screen.getByText('05')).toBeInTheDocument();
        expect(screen.getByText('Ticks')).toBeInTheDocument();
        expect(screen.getByText('OK')).toBeInTheDocument();
    });
});
