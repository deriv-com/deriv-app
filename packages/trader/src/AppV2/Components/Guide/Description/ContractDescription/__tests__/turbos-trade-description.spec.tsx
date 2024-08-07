import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getTerm } from 'AppV2/Utils/contract-description-utils';
import TurbosTradeDescription from '../turbos-trade-description';

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('TurbosTradeDescription', () => {
    it('should render a proper content', () => {
        render(<TurbosTradeDescription onTermClick={jest.fn()} />);

        expect(screen.getByText(/You may sell the contract up to 15 seconds before expiry/i)).toBeInTheDocument();
    });

    it('should call onTermClick if user clicks on term "payout"', () => {
        const onTermClick = jest.fn();
        render(<TurbosTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: getTerm().PAYOUT.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "expiry"', () => {
        const onTermClick = jest.fn();
        render(<TurbosTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: getTerm().EXPIRY.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "barrier"', () => {
        const onTermClick = jest.fn();
        render(<TurbosTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: getTerm().BARRIER.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "payout per point"', () => {
        const onTermClick = jest.fn();
        render(<TurbosTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: getTerm().PAYOUT_PER_POINT.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "final price"', () => {
        const onTermClick = jest.fn();
        render(<TurbosTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: getTerm().FINAL_PRICE.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "contract value"', () => {
        const onTermClick = jest.fn();
        render(<TurbosTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: getTerm().CONTRACT_VALUE.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });
});
