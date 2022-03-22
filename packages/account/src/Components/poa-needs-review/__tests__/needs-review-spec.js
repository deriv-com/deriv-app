import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { screen, render } from '@testing-library/react';
import { NeedsReview } from '../needs-review';


jest.mock('Components/poa-continue-trading-button/continue-trading-button.jsx', () => ({
    ContinueTradingButton: jest.fn(() => <div>ContinueTradingButton</div>),
}));

describe('<NeedsReview/>', () => {

    it('should render NeedsReview component if it does not need poi', () => {

        render(
        <BrowserRouter>
            <NeedsReview needs_poi={false} is_description_enabled />
        </BrowserRouter>
        )

        expect(screen.getByText('Your proof of address was submitted successfully')).toBeInTheDocument();
        expect(screen.getByText('ContinueTradingButton')).toBeInTheDocument();
    });

    it('should render NeedsReview component if it needs poi', () => {

        render(
        <BrowserRouter>
            <NeedsReview needs_poi is_description_enabled />
        </BrowserRouter>
        )

        expect(screen.getByText('Your proof of address was submitted successfully')).toBeInTheDocument();
        expect(screen.getByText('You must also submit a proof of identity.')).toBeInTheDocument();
    });
});
