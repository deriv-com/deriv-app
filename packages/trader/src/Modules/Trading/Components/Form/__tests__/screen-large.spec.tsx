import React from 'react';

import { render, screen } from '@testing-library/react';

import ScreenLarge from '../screen-large';

jest.mock('App/Components/Elements/ContentLoader', () => ({
    ...jest.requireActual('App/Components/Elements/ContentLoader'),
    TradeParamsLoader: jest.fn(() => 'MockedLoader'),
}));
jest.mock('../../../Containers/contract-type', () => jest.fn(() => 'MockedContractType'));
jest.mock('../../../Containers/purchase', () => jest.fn(() => 'MockedPurchase'));
jest.mock('../../../Containers/trade-params', () => jest.fn(() => 'MockedTradeParams'));

const mock_props = {
    is_market_closed: false,
    is_trade_enabled: false,
};

describe('ScreenLarge', () => {
    it('should render TradeParamsLoader component if is_market_closed is false', () => {
        render(<ScreenLarge {...mock_props} />);

        expect(screen.getByText('MockedLoader')).toBeInTheDocument();
    });
    it('should render ContractType, TradeParams and Purchase component if is_trade_enabled is true', () => {
        render(<ScreenLarge is_trade_enabled />);

        expect(screen.getByText('MockedContractType')).toBeInTheDocument();
        expect(screen.getByText('MockedPurchase')).toBeInTheDocument();
        expect(screen.getByText('MockedTradeParams')).toBeInTheDocument();
    });
});
