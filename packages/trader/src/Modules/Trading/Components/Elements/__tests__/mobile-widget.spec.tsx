import React from 'react';
import { screen, render } from '@testing-library/react';
import MobileWidget from '../mobile-widget';
import { TStores } from '@deriv/stores/types';
import TraderProviders from '../../../../../trader-providers';
import { mockStore } from '@deriv/stores';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getExpiryType: () => 'tick',
}));

jest.mock('../../../Containers/trade-params-mobile.tsx', () => jest.fn(() => 'mockedTradeParamsMobile'));

jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/widgets', () => ({
    ...jest.requireActual('Modules/Trading/Components/Form/TradeParams/Multiplier/widgets'),
    MultiplierAmountWidget: () => <div>mockedMultiplierAmountWidgets</div>,
}));

describe('<MobileWidget />', () => {
    const store_config = mockStore({});
    const mockMobileWidget = ({ mocked_store_props = store_config }) => (
        <TraderProviders store={mocked_store_props}>
            <MobileWidget />
        </TraderProviders>
    );
    let mocked_store_props: TStores;

    beforeEach(() => {
        mocked_store_props = mockStore({
            modules: {
                trade: {
                    amount: 100,
                    basis: '100',
                    currency: 'USD',
                    duration: 10,
                    duration_min_max: {
                        daily: {
                            min: 86400,
                            max: 31536000,
                        },
                        intraday: {
                            min: 15,
                            max: 86400,
                        },
                        tick: {
                            min: 1,
                            max: 10,
                        },
                    },
                    duration_unit: 's',
                    is_multiplier: true,
                    onChange: jest.fn(),
                },
            },
        });
    });

    it('should render mocked multiplier amount widgets if is_multiplier is true', () => {
        render(mockMobileWidget({ mocked_store_props }));
        expect(screen.getByText(/mockedmultiplieramountwidgets/i)).toBeInTheDocument();
        expect(screen.getByText(/mockedtradeparamsmobile/i)).toBeInTheDocument();
    });
    it('should render general widgets if is_multiplier is false', () => {
        mocked_store_props.modules.trade.is_multiplier = false;
        render(mockMobileWidget({ mocked_store_props }));
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
        expect(screen.getByText('10 seconds')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
    });
});
