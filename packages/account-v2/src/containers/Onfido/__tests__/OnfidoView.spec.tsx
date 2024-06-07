import React from 'react';
import { render, screen } from '@testing-library/react';
import { OnfidoView } from '../OnfidoView';

const defaultProps = {
    isOnfidoEnabled: true,
    isOnfidoInitialized: true,
    onfidoElementId: 'onfido-element',
    showStatusMessage: false,
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

const onfidoElementTestId = 'dt_onfido_element';

describe('OnfidoView', () => {
    it('should render without errors', () => {
        render(<OnfidoView {...defaultProps} />);
        const onfidoElement = screen.getByTestId(onfidoElementTestId);
        expect(onfidoElement).toBeInTheDocument();
    });

    it('should render the status message when showStatusMessage is true', () => {
        render(<OnfidoView {...defaultProps} showStatusMessage={true} />);
        const statusMessage = screen.getByText('Your personal details have been saved successfully.');
        expect(statusMessage).toBeInTheDocument();
    });

    it('should render the info message when isOnfidoInitialized is true and isOnfidoEnabled is false', () => {
        render(<OnfidoView {...defaultProps} isOnfidoEnabled={false} isOnfidoInitialized={true} />);
        const infoMessage = screen.getByText('Hit the checkbox above to choose your document.');
        expect(infoMessage).toBeInTheDocument();
    });

    it('should hide element if onfido not initialized', () => {
        render(<OnfidoView {...defaultProps} isOnfidoEnabled={true} isOnfidoInitialized={false} />);
        const onfidoElement = screen.getByTestId(onfidoElementTestId);
        expect(onfidoElement).toHaveClass('hidden');
    });

    it('should render correctly if onfido not enabled', () => {
        render(<OnfidoView {...defaultProps} isOnfidoEnabled={false} isOnfidoInitialized={true} />);
        const onfidoElement = screen.getByTestId(onfidoElementTestId);
        expect(onfidoElement).toHaveClass('opacity-48 pointer-events-none');
    });
});
