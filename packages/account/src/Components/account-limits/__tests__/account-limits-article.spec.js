import React from 'react';
import { screen, render } from '@testing-library/react';
import AccountLimitsArticle from '../account-limits-article';

describe('<AccountLimitsArticle/>', () => {
    it('should render AccountLimitsArticle component', () => {
        render(<AccountLimitsArticle />);
        expect(screen.getByText('Account limits')).toBeInTheDocument();
    });

    it('should show the descriptions for the account limit', () => {
        render(<AccountLimitsArticle />);
        expect(screen.getByText('These are default limits that we apply to your accounts.')).toBeInTheDocument();
    });

    it('should go to help-centre page if the Help Centre link on the text is clicked', () => {
        render(<AccountLimitsArticle />);
        expect(screen.getByText('Help Centre.').closest('a')).toHaveAttribute('href', 'https://deriv.com/help-centre');
    });
});
