import React from 'react';
import { screen, render } from '@testing-library/react';
import TraderProviders from '../../../../../../../trader-providers';
import DurationMobile from '../duration-mobile';
import { mockStore } from '@deriv/stores';

jest.mock('@deriv/components', () => {
    return {
        ...jest.requireActual('@deriv/components'),
        Tabs: jest.fn(({ onTabItemClick, children }) => (
            <div>
                {children}
                <button onClick={() => onTabItemClick(0)}>Button</button>
            </div>
        )),
    };
});

jest.mock('../duration-ticks-widget-mobile.tsx', () => jest.fn(() => 'MockedDurationTicksWidgetMobile'));
jest.mock('../duration-numbers-widget-mobile.tsx', () => jest.fn(() => 'MockedDurationNumbersWidgetMobile'));

describe('<DurationMobile />', () => {
    let mock_store: ReturnType<typeof mockStore>, default_props: React.ComponentProps<typeof DurationMobile>;
    beforeEach(() => {
        mock_store = {
            ...mockStore({
                modules: {
                    trade: {
                        duration_units_list: [
                            {
                                text: 'Ticks',
                                value: 't',
                            },
                            {
                                text: 'Seconds',
                                value: 's',
                            },
                            {
                                text: 'Minutes',
                                value: 'm',
                            },
                            {
                                text: 'Hours',
                                value: 'h',
                            },
                            {
                                text: 'Days',
                                value: 'd',
                            },
                            {
                                text: 'Weeks',
                                value: 'w',
                            },
                        ],
                        duration_unit: 't',
                        basis: 'stake',
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
                        validation_errors: {},
                    },
                },
            }),
        };
        default_props = {
            amount_tab_idx: 0,
            d_duration: 1,
            duration_tab_idx: 1,
            expiry_epoch: 1703057788,
            h_duration: 1,
            has_amount_error: false,
            m_duration: 1,
            payout_value: 123,
            s_duration: 1,
            setDurationError: jest.fn(),
            setDurationTabIdx: jest.fn(),
            setSelectedDuration: jest.fn(),
            stake_value: 12,
            t_duration: 1,
            toggleModal: jest.fn(),
        };
    });
    const renderDurationMobile = (
        mock_store: ReturnType<typeof mockStore>,
        default_props: React.ComponentProps<typeof DurationMobile>
    ) => {
        return render(
            <TraderProviders store={mock_store}>
                <DurationMobile {...default_props} />
            </TraderProviders>
        );
    };
    it('Should render 1 Ticks Widget, 4 Numbers Widget and mocked date picker', () => {
        renderDurationMobile(mock_store, default_props);
        expect(screen.getByText(/mockeddurationtickswidgetmobile/i)).toBeInTheDocument();
        expect(screen.getAllByText(/mockeddurationnumberswidgetmobile/i)).toHaveLength(4);
        expect(screen.getByText(/pick an end date/i)).toBeInTheDocument();
    });
});
