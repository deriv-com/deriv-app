import React from 'react';
import { screen, render } from '@testing-library/react';
import { ChartBottomWidgets, ChartTopWidgets, DigitsWidget } from '../chart-widgets';
import TraderProviders from '../../../../trader-providers';

import { mockStore } from '@deriv/stores';

jest.mock('../../../Contract/Components/Digits/digits.tsx', () => jest.fn(() => <div>mockedDigits</div>));
jest.mock('../../../SmartChart/Components/top-widgets.tsx', () => jest.fn(() => <div>mockedTopWidgets</div>));
jest.mock('../../../SmartChart/Components/bottom-widgets.tsx', () => jest.fn(() => <div>mockedBottomWidget</div>));

describe('<DigitsWidget />', () => {
    const mocked_store_props = {
        modules: {
            trade: {
                symbol: 'test',
                onChange: jest.fn(),
                contract_type: 'test_contract',
                last_digit: 3,
            },
            contract_trade: {
                last_contract: {
                    contract_info: {},
                    digits_info: {},
                    display_status: '',
                    is_digit_contract: true,
                    is_ended: false,
                },
            },
        },
    };

    const store = mockStore(mocked_store_props);

    const mockMobileWidget = () => (
        <TraderProviders store={store}>
            <DigitsWidget digits={[0, 1, 2, 3, 4, 5]} tick={{ pip_size: 1 }} />
        </TraderProviders>
    );
    it('Should render mocked digits', () => {
        render(mockMobileWidget());
        expect(screen.getByText(/mockeddigits/i)).toBeInTheDocument();
    });
});

describe('<ChartTopWidgets>', () => {
    const mocked_store_props = {
        modules: {
            trade: {
                is_digits_widget_active: true,
                onChange: jest.fn(),
            },
            ui: {
                is_dark_mode_on: true,
                is_mobile: true,
            },
        },
    };
    const store = mockStore(mocked_store_props);

    const mockChartTopWidget = () => (
        <TraderProviders store={store}>
            <ChartTopWidgets open_market={{ category: '', subcategory: '' }} open />
        </TraderProviders>
    );
    it('Should render mocked ChartTopWidget', () => {
        render(mockChartTopWidget());
        expect(screen.getByText(/mockedtopwidgets/i)).toBeInTheDocument();
    });
});

describe('<ChartBottomWidgets>', () => {
    it('Should render mocked ChartBottomWidgets', () => {
        render(
            <ChartBottomWidgets digits={[0, 1, 2, 3, 4, 5]} tick={{ pip_size: 1 }} show_accumulators_stats={false} />
        );
        expect(screen.getByText(/mockedbottomwidget/i)).toBeInTheDocument();
    });
});
