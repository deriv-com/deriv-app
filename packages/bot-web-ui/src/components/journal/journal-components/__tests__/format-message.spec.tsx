import React from 'react';
import { render, screen } from '@testing-library/react';
import FormatMessage from '../format-message';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));

describe('FormatMessage', () => {
    it('should render FilterDialog component with log_type LOAD_BLOCK ', () => {
        const { container } = render(<FormatMessage logType='load_block' extra={''} />);
        expect(container).toBeInTheDocument();
        expect(screen.getByText('Blocks are loaded successfully')).toBeInTheDocument();
    });

    it('should render message for log_type NOT_OFFERED', () => {
        render(<FormatMessage logType='not_offered' extra={''} />);
        expect(screen.getByText('Resale of this contract is not offered.')).toBeInTheDocument();
    });

    it('should render message for log_type PURCHASE', () => {
        const extra = {
            longcode: 'Win payout Volatility 100 (1s) Index',
            transaction_id: 10203,
        };
        const { container } = render(<FormatMessage logType='purchase' extra={extra} />);
        expect(container).toHaveTextContent('Bought: Win payout Volatility 100 (1s) Index (ID: 10203)');
    });

    it('should render message for log_type SELL', () => {
        const extra = { sold_for: '20' };
        const { container } = render(<FormatMessage logType='sell' extra={extra} />);
        expect(container).toHaveTextContent('Sold for: 20');
    });

    it('should render message for log_type PROFIT', () => {
        const extra = { currency: 'USD', profit: '20' };
        const { container } = render(<FormatMessage logType='profit' extra={extra} />);
        expect(container).toHaveTextContent('Profit amount: 20');
    });

    it('should render message for log_type LOSS', () => {
        const extra = { currency: 'USD', profit: '20' };
        const { container } = render(<FormatMessage logType='lost' extra={extra} />);
        expect(container).toHaveTextContent('Loss amount: 20');
    });

    it('should render message for log_type WELCOME_BACK with currency', () => {
        const extra = { current_currency: 'USD' };
        const { container } = render(<FormatMessage logType='welcome_back' extra={extra} />);
        expect(container).toHaveTextContent(
            'Welcome back! Your messages have been restored. You are using your USD account.'
        );
    });

    it('should render message for log_type WELCOME_BACK', () => {
        const extra = {};
        render(<FormatMessage logType='welcome_back' extra={extra} />);
        expect(screen.getByText('Welcome back! Your messages have been restored.')).toBeInTheDocument();
    });

    it('should render message for log_type WELCOME', () => {
        const extra = { current_currency: 'USD' };
        const { container } = render(<FormatMessage logType='welcome' extra={extra} />);
        expect(container).toHaveTextContent('You are using your USD account.');
    });

    it('should render null for log_type WELCOME', () => {
        const extra = { current_currency: null };
        const { container } = render(<FormatMessage logType='welcome' extra={extra} />);
        expect(container).not.toHaveTextContent('You are using your USD account.');
    });

    it('should render null for an unknown log_type', () => {
        const { container } = render(<FormatMessage logType='' extra={''} />);
        expect(container).not.toHaveTextContent('Welcome back!.');
    });
});
