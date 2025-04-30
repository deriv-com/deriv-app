import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyPortfolioMessage from '../empty-portfolio-message';

describe('EmptyPortfolioMessage', () => {
    const empty_portfolio_message = 'You have no open positions.';
    const error_text = 'Error text';

    it('should render error text on the screen if EmptyPortfolioMessage component will recive error in props', () => {
        render(<EmptyPortfolioMessage error={error_text} />);

        expect(screen.getByText(error_text)).toBeInTheDocument();
        expect(screen.queryByText(empty_portfolio_message)).not.toBeInTheDocument();
    });
    it('should render empty_portfolio_message on the screen if EmptyPortfolioMessage component will not recive error in props', () => {
        render(<EmptyPortfolioMessage />);

        expect(screen.queryByText(error_text)).not.toBeInTheDocument();
        expect(screen.getByText(empty_portfolio_message)).toBeInTheDocument();
    });
});
