import React from 'react';
import { screen, render } from '@testing-library/react';
import AccountLimitsArticle from '../account-limits-article';

describe('<AccountLimitsArticle/>', () => {
    it('should render AccountLimitsArticle component', () => {
        render(<AccountLimitsArticle />);
        expect(
            screen.getByRole('heading', {
                name: /account limits/i,
            })
        ).toBeInTheDocument();
    });

    it('should show the descriptions for the account limit', () => {
        render(<AccountLimitsArticle />);
        expect(screen.getByText(/these are default limits that we apply to your accounts\./i)).toBeInTheDocument();
    });
});
