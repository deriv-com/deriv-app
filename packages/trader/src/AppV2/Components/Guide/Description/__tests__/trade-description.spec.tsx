import React from 'react';
import { render, screen } from '@testing-library/react';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import TradeDescription from '../trade-description';

jest.mock('../Contract description/accumulators-trade-description', () =>
    jest.fn(() => 'mockAccumulatorTradeDescription')
);
jest.mock('../Contract description/even-odd-trade-description', () => jest.fn(() => 'mockEvenOddTradeDescription'));
jest.mock('../Contract description/higher-lower-trade-description', () =>
    jest.fn(() => 'mockHigherLowerTradeDescription')
);
jest.mock('../Contract description/matches-differs-trade-description', () =>
    jest.fn(() => 'mockMatchesDiffersTradeDescription')
);
jest.mock('../Contract description/multipliers-trade-description', () =>
    jest.fn(() => 'mockMultipliersTradeDescription')
);
jest.mock('../Contract description/over-under-trade-description', () => jest.fn(() => 'mockOverUnderTradeDescription'));
jest.mock('../Contract description/rise-fall-trade-description', () => jest.fn(() => 'mockRiseFallTradeDescription'));
jest.mock('../Contract description/touch-no-touch-trade-description', () => jest.fn(() => 'mockTouchTradeDescription'));
jest.mock('../Contract description/turbos-trade-description', () => jest.fn(() => 'mockTurbosTradeDescription'));
jest.mock('../Contract description/vanillas-trade-description', () => jest.fn(() => 'mockVanillasTradeDescription'));

describe('TradeDescription', () => {
    it('should render mockAccumulatorTradeDescription when trade category is "CONTRACT_LIST.ACCUMULATORS"', () => {
        render(<TradeDescription contract_type={CONTRACT_LIST.ACCUMULATORS} onTermClick={jest.fn()} />);
        expect(screen.getByText(/mockAccumulatorTradeDescription/i)).toBeInTheDocument();
    });

    it('should render mockEvenOddTradeDescription when trade category is "CONTRACT_LIST[EVEN/ODD]"', () => {
        render(<TradeDescription contract_type={CONTRACT_LIST['EVEN/ODD']} onTermClick={jest.fn()} />);
        expect(screen.getByText(/mockEvenOddTradeDescription/i)).toBeInTheDocument();
    });

    it('should render mockHigherLowerTradeDescription when trade category is "CONTRACT_LIST[HIGHER/LOWER]"', () => {
        render(<TradeDescription contract_type={CONTRACT_LIST['HIGHER/LOWER']} onTermClick={jest.fn()} />);
        expect(screen.getByText(/mockHigherLowerTradeDescription/i)).toBeInTheDocument();
    });

    it('should render mockMatchesDiffersTradeDescription when trade category is "CONTRACT_LIST[MATCHES/DIFFERS]"', () => {
        render(<TradeDescription contract_type={CONTRACT_LIST['MATCHES/DIFFERS']} onTermClick={jest.fn()} />);
        expect(screen.getByText(/mockMatchesDiffersTradeDescription/i)).toBeInTheDocument();
    });

    it('should render mockMultipliersTradeDescription when trade category is "CONTRACT_LIST.MULTIPLIERS"', () => {
        render(<TradeDescription contract_type={CONTRACT_LIST.MULTIPLIERS} onTermClick={jest.fn()} />);
        expect(screen.getByText(/mockMultipliersTradeDescription/i)).toBeInTheDocument();
    });

    it('should render mockOverUnderTradeDescription when trade category is "CONTRACT_LIST[OVER/UNDER]"', () => {
        render(<TradeDescription contract_type={CONTRACT_LIST['OVER/UNDER']} onTermClick={jest.fn()} />);
        expect(screen.getByText(/mockOverUnderTradeDescription/i)).toBeInTheDocument();
    });

    it('should render mockRiseFallTradeDescription when trade category is "CONTRACT_LIST[RISE/FALL]"', () => {
        render(<TradeDescription contract_type={CONTRACT_LIST['RISE/FALL']} onTermClick={jest.fn()} />);
        expect(screen.getByText(/mockRiseFallTradeDescription/i)).toBeInTheDocument();
    });

    it('should render mockTouchTradeDescription when trade category is "CONTRACT_LIST[TOUCH/NO TOUCH]"', () => {
        render(<TradeDescription contract_type={CONTRACT_LIST['TOUCH/NO TOUCH']} onTermClick={jest.fn()} />);
        expect(screen.getByText(/mockTouchTradeDescription/i)).toBeInTheDocument();
    });

    it('should render mockTurbosTradeDescription when trade category is "CONTRACT_LIST.TURBOS"', () => {
        render(<TradeDescription contract_type={CONTRACT_LIST.TURBOS} onTermClick={jest.fn()} />);
        expect(screen.getByText(/mockTurbosTradeDescription/i)).toBeInTheDocument();
    });

    it('should render mockVanillasTradeDescription when trade category is "CONTRACT_LIST.VANILLAS"', () => {
        render(<TradeDescription contract_type={CONTRACT_LIST.VANILLAS} onTermClick={jest.fn()} />);
        expect(screen.getByText(/mockVanillasTradeDescription/i)).toBeInTheDocument();
    });

    it('should render "description is not found" when contract_type was not passed', () => {
        render(<TradeDescription contract_type='some_trade_type' onTermClick={jest.fn()} />);
        expect(screen.getByText(/Description not found./i)).toBeInTheDocument();
    });
});
