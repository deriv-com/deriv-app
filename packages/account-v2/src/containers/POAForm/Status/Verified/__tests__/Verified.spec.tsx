import React from 'react';
import { Button } from '@deriv/components';
import { render, screen } from '@testing-library/react';
import { Verified } from '../Verified';

const mockRedirectionButton = <Button>Redirection button</Button>;

describe('<Verified/>', () => {
    const message = 'Your proof of address is verified';
    const needsPOIMessage = 'To continue trading, you must also submit a proof of identity.';

    it('should render Verified component without needs_poi', () => {
        render(<Verified needsPOI={false} redirectButton={mockRedirectionButton} />);

        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.queryByText('ContinueTradingButton')).not.toBeInTheDocument();
        expect(screen.queryByText(needsPOIMessage)).not.toBeInTheDocument();
        expect(screen.queryByText('PoiButton')).not.toBeInTheDocument();
        expect(screen.queryByRole('button')).toBeInTheDocument();
    });

    it('should render Verified component without needsPOI and is_description_enabled', () => {
        render(<Verified needsPOI={false} redirectButton={false} />);

        expect(screen.getByText('ContinueTradingButton')).toBeInTheDocument();
        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.queryByText(needsPOIMessage)).not.toBeInTheDocument();
        expect(screen.queryByText('PoiButton')).not.toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should render Verified component with needsPOI', () => {
        render(<Verified needsPOI={true} redirectButton={mockRedirectionButton} />);

        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.getByText(needsPOIMessage)).toBeInTheDocument();
        expect(screen.getByText('PoiButton')).toBeInTheDocument();
        expect(screen.queryByText('ContinueTradingButton')).not.toBeInTheDocument();
    });
});
