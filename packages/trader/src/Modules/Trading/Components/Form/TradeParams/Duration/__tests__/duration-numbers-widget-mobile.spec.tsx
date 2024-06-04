import React from 'react';
import { screen, render } from '@testing-library/react';
import TraderProviders from '../../../../../../../trader-providers';
import { mockStore } from '@deriv/stores';
import DurationNumbersWidgetMobile from '../duration-numbers-widget-mobile';
import * as durationUtils from '../duration-utils';
import userEvent from '@testing-library/user-event';

jest.mock('../duration-range-text.tsx', () => jest.fn(() => <div>MockedDurationRangeText</div>));
jest.mock('../expiry-text.tsx', () => jest.fn(() => <div>MockedExpiryText</div>));
jest.spyOn(durationUtils, 'updateAmountChanges');
describe('<DurationTicksWidgetMobile />', () => {
    let mock_store: ReturnType<typeof mockStore>,
        default_props: React.ComponentProps<typeof DurationNumbersWidgetMobile>;
    beforeEach(() => {
        mock_store = {
            ...mockStore({
                ui: {
                    addToast: jest.fn(),
                },
                modules: {
                    trade: {
                        amount: 123,
                        basis: 'stake',
                        duration: 5,
                        duration_unit: 'd',
                        duration_min_max: {
                            daily: {
                                min: 1234,
                                max: 2345,
                            },
                            intraday: {
                                min: 12345,
                                max: 23456,
                            },
                        },
                        onChangeMultiple: jest.fn(),
                    },
                },
            }),
        };
        default_props = {
            contract_expiry: 'daily',
            duration_unit_option: {
                text: 'Minutes',
                value: 'm',
            },
            duration_values: {
                t_duration: 5,
                s_duration: 15,
                m_duration: 35,
                h_duration: 1,
                d_duration: 1,
            },
            expiry_epoch: 1703242581,
            show_expiry: false,
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
    const renderDurationNumbersWidgetMobile = (
        mock_store: ReturnType<typeof mockStore>,
        default_props: React.ComponentProps<typeof DurationNumbersWidgetMobile>
    ) => {
        return render(
            <TraderProviders store={mock_store}>
                <DurationNumbersWidgetMobile {...default_props} />
            </TraderProviders>
        );
    };
    it('should render Mocked duration range text', () => {
        renderDurationNumbersWidgetMobile(mock_store, default_props);
        expect(screen.getByText(/mockeddurationrangetext/i)).toBeInTheDocument();
    });
    it('should render mocked expiry text if show_expiry is true', () => {
        default_props.show_expiry = true;
        renderDurationNumbersWidgetMobile(mock_store, default_props);
        expect(screen.getByText(/mockedexpirytext/i)).toBeInTheDocument();
    });
    it('Should show validation messages if selected_duration is less than minimum', () => {
        default_props.selected_duration = 11;
        renderDurationNumbersWidgetMobile(mock_store, default_props);
        expect(mock_store.ui.addToast).toHaveBeenCalled();
        expect(default_props.setDurationError).toHaveBeenCalledWith(true);
    });
    it('Should show validation messages if selected_duration is empty', () => {
        default_props.selected_duration = '' as unknown as number;
        renderDurationNumbersWidgetMobile(mock_store, default_props);
        expect(mock_store.ui.addToast).toHaveBeenCalled();
        expect(default_props.setDurationError).toHaveBeenCalledWith(true);
    });
    it('Should call setDurationError with false value and should not call addToast when there is not validation error', () => {
        default_props.selected_duration = 21;
        renderDurationNumbersWidgetMobile(mock_store, default_props);
        expect(mock_store.ui.addToast).not.toHaveBeenCalled();
        expect(default_props.setDurationError).toHaveBeenCalledWith(false);
    });
    it('should call updateAmountChanges, onChangeMultiple, and toggleModal if there is has_amount_error is false, duration is changed and user clicks ok', () => {
        default_props.selected_duration = 21;
        renderDurationNumbersWidgetMobile(mock_store, default_props);
        userEvent.click(screen.getByText(/ok/i));
        expect(durationUtils.updateAmountChanges).toHaveBeenCalled();
        expect(default_props.toggleModal).toHaveBeenCalled();
        expect(mock_store.modules.trade.onChangeMultiple).toHaveBeenCalledWith({
            amount: 10,
            basis: 'payout',
            duration: 21,
            duration_unit: 'm',
            expiry_type: 'duration',
        });
    });
});
