import React from 'react';
import { screen, render } from '@testing-library/react';
import { Verified } from '../verified';

jest.mock('Components/poa/continue-trading-button/continue-trading-button', () => ({
    ContinueTradingButton: jest.fn(() => <div>ContinueTradingButton</div>),
}));
jest.mock('Components/poi/poi-button/poi-button.jsx', () => ({
    PoiButton: jest.fn(() => <div>PoiButton</div>),
}));

describe('<Verified/>', () => {
    const message = 'Your proof of address is verified';
    const needs_poi_msg = 'To continue trading, you must also submit a proof of identity.';

    it('should render Verified component without needs_poi', () => {
        render(<Verified needs_poi={false} />);

        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.queryByText('ContinueTradingButton')).not.toBeInTheDocument();
        expect(screen.queryByText(needs_poi_msg)).not.toBeInTheDocument();
        expect(screen.queryByText('PoiButton')).not.toBeInTheDocument();
    });

    it('should render Verified component without needs_poi and is_description_enabled', () => {
        render(<Verified needs_poi={false} is_description_enabled={false} />);

        expect(screen.getByText('ContinueTradingButton')).toBeInTheDocument();
        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.queryByText(needs_poi_msg)).not.toBeInTheDocument();
        expect(screen.queryByText('PoiButton')).not.toBeInTheDocument();
    });

    it('should render Verified component with needs_poi', () => {
        render(<Verified needs_poi={true} />);

        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.getByText(needs_poi_msg)).toBeInTheDocument();
        expect(screen.getByText('PoiButton')).toBeInTheDocument();
        expect(screen.queryByText('ContinueTradingButton')).not.toBeInTheDocument();
    });
});
