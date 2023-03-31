import { render, screen } from '@testing-library/react';

import { Button } from '@deriv/components';
import React from 'react';
import { Verified } from '../verified';

jest.mock('Components/poa/continue-trading-button/continue-trading-button', () => ({
    ContinueTradingButton: jest.fn(() => <div>ContinueTradingButton</div>),
}));
jest.mock('Components/poi/poi-button/poi-button', () => ({
    PoiButton: jest.fn(() => <div>PoiButton</div>),
}));

const mock_redirection_btn = <Button>Redirection button</Button>;

describe('<Verified/>', () => {
    const message = 'Your proof of address is verified';
    const needs_poi_msg = 'To continue trading, you must also submit a proof of identity.';

    it('should render Verified component without needs_poi', () => {
        render(<Verified needs_poi={false} redirect_button={mock_redirection_btn} />);

        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.queryByText('ContinueTradingButton')).not.toBeInTheDocument();
        expect(screen.queryByText(needs_poi_msg)).not.toBeInTheDocument();
        expect(screen.queryByText('PoiButton')).not.toBeInTheDocument();
        expect(screen.queryByRole('button')).toBeInTheDocument();
    });

    it('should render Verified component without needs_poi and is_description_enabled', () => {
        render(<Verified needs_poi={false} redirect_button={false} />);

        expect(screen.getByText('ContinueTradingButton')).toBeInTheDocument();
        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.queryByText(needs_poi_msg)).not.toBeInTheDocument();
        expect(screen.queryByText('PoiButton')).not.toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should render Verified component with needs_poi', () => {
        render(<Verified needs_poi={true} redirect_button={mock_redirection_btn} />);

        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.getByText(needs_poi_msg)).toBeInTheDocument();
        expect(screen.getByText('PoiButton')).toBeInTheDocument();
        expect(screen.queryByText('ContinueTradingButton')).not.toBeInTheDocument();
    });
});
