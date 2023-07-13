import { render, screen } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { Button } from '@deriv/components';
import { NeedsReview } from '../needs-review';
import React from 'react';

jest.mock('Components/poa/continue-trading-button/continue-trading-button', () => ({
    ContinueTradingButton: jest.fn(() => <div>ContinueTradingButton</div>),
}));

const mock_redirection_btn = <Button>Redirection button</Button>;

describe('<NeedsReview/>', () => {
    it('should render NeedsReview component if it does not need poi', () => {
        render(
            <BrowserRouter>
                <NeedsReview needs_poi={false} redirect_button={false} />
            </BrowserRouter>
        );

        expect(screen.getByText('Your proof of address was submitted successfully')).toBeInTheDocument();
        expect(screen.getByText('Your document is being reviewed, please check back in 1-3 days.')).toBeInTheDocument();
        expect(screen.getByText('ContinueTradingButton')).toBeInTheDocument();
    });

    it('should render NeedsReview component if it does not need poi and is_description_enabled', () => {
        render(
            <BrowserRouter>
                <NeedsReview needs_poi={false} redirect_button={mock_redirection_btn} />
            </BrowserRouter>
        );

        expect(screen.getByText('Your proof of address was submitted successfully')).toBeInTheDocument();
        expect(screen.getByText('Your document is being reviewed, please check back in 1-3 days.')).toBeInTheDocument();
        expect(screen.queryByText('ContinueTradingButton')).not.toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render NeedsReview component if it needs poi', () => {
        render(
            <BrowserRouter>
                <NeedsReview needs_poi redirect_button={mock_redirection_btn} />
            </BrowserRouter>
        );

        expect(screen.getByText('Your proof of address was submitted successfully')).toBeInTheDocument();
        expect(screen.getByText('Your document is being reviewed, please check back in 1-3 days.')).toBeInTheDocument();
        expect(screen.getByText('You must also submit a proof of identity.')).toBeInTheDocument();
    });
});
