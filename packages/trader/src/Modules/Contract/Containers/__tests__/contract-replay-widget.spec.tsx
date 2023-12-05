import React from 'react';
import { screen, render } from '@testing-library/react';
import { InfoBoxWidget, ChartBottomWidgets, ChartTopWidgets, DigitsWidget } from '../contract-replay-widget';
import TraderProviders from '../../../../trader-providers';
import { mockStore } from '@deriv/stores';

jest.mock('../../Components/Digits/digits.tsx', () => jest.fn(() => <div>mockedDigits</div>));
jest.mock('../../Components/InfoBox/info-box.tsx', () => jest.fn(() => <div>mockedInfoBox</div>));
jest.mock('../../../SmartChart/Components/top-widgets.tsx', () => jest.fn(() => <div>mockedTopWidgets</div>));
jest.mock('../../../SmartChart/Components/bottom-widgets.tsx', () => jest.fn(() => <div>mockedBottomWidget</div>));

describe('<DigitsWidget />', () => {
    const mocked_store_props = {
        contract_replay: {
            contract_store: {
                contract_info: {},
                digits_info: {},
                display_status: '',
                is_digit_contract: true,
                is_ended: false,
            },
        },
    };

    const store = mockStore(mocked_store_props);

    const mockMobileWidget = () => (
        <TraderProviders store={store}>
            <DigitsWidget />
        </TraderProviders>
    );
    it('Should render mocked digits', () => {
        render(mockMobileWidget());
        expect(screen.getByText(/mockeddigits/i)).toBeInTheDocument();
    });
});

describe('<InfoBoxWidget />', () => {
    const mocked_store_props = {
        contract_replay: {
            contract_store: {
                contract_info: {},
            },
            removeErrorMessage: jest.fn(),
            error_message: '',
        },
    };

    const store = mockStore(mocked_store_props);

    const mockInfoBoxWidget = () => (
        <TraderProviders store={store}>
            <InfoBoxWidget />
        </TraderProviders>
    );
    it('Should render mocked digits', () => {
        render(mockInfoBoxWidget());
        expect(screen.getByText(/mockedInfoBox/i)).toBeInTheDocument();
    });
});

describe('<ChartTopWidgets>', () => {
    const mocked_store_props = {};
    const store = mockStore(mocked_store_props);

    const mockChartTopWidget = () => (
        <TraderProviders store={store}>
            <ChartTopWidgets />
        </TraderProviders>
    );
    it('Should render mocked ChartTopWidget', () => {
        render(mockChartTopWidget());
        expect(screen.getByText(/mockedtopwidgets/i)).toBeInTheDocument();
    });
});

describe('<ChartBottomWidgets>', () => {
    it('Should render mocked ChartBottomWidgets', () => {
        render(<ChartBottomWidgets />);
        expect(screen.getByText(/mockedbottomwidget/i)).toBeInTheDocument();
    });
});
