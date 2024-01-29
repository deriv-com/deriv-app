import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Button } from '@deriv/components';
import { render, screen } from '@testing-library/react';
import NeedsReview from '..';

const mockRedirectionButton = <Button>Redirection button</Button>;

const title = 'Your proof of address was submitted successfully';
const message = 'Your document is being reviewed, please check back in 1-3 days.';

describe('<NeedsReview/>', () => {
    it('should render NeedsReview component if it does not need poi', () => {
        render(
            <BrowserRouter>
                <NeedsReview needsPOI={false} redirectButton={false} />
            </BrowserRouter>
        );

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.getByText('ContinueTradingButton')).toBeInTheDocument();
    });

    it('should render NeedsReview component if it does not need poi and is_description_enabled', () => {
        render(
            <BrowserRouter>
                <NeedsReview needsPOI={false} redirectButton={mockRedirectionButton} />
            </BrowserRouter>
        );

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.queryByText('ContinueTradingButton')).not.toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render NeedsReview component if it needs poi', () => {
        render(
            <BrowserRouter>
                <NeedsReview needsPOI redirectButton={mockRedirectionButton} />
            </BrowserRouter>
        );

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.getByText('You must also submit a proof of identity.')).toBeInTheDocument();
    });
});
