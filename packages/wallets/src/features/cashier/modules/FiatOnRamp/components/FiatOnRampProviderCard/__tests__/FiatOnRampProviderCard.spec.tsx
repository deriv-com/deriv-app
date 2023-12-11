import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import FiatOnRampProviderCard from '../FiatOnRampProviderCard';

describe('FiatOnRampProviderCard', () => {
    const mockProvider = {
        description: 'Test Description',
        getPaymentIcons: () => [{ icon: <div key='test-icon'>Test Icon</div>, name: 'test-icon' }],
        handleDisclaimer: jest.fn(),
        icon: <div>Test Logo</div>,
        name: 'Test Provider',
    };

    it('should render component correctly', () => {
        render(<FiatOnRampProviderCard {...mockProvider} />);

        expect(screen.getByText('Test Provider')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByTestId('dt_payment-method-icon-test-icon')).toBeInTheDocument();
        expect(screen.getByText('Select')).toBeInTheDocument();
    });

    it('should call handleDisclaimer function on "Select" button click', () => {
        render(<FiatOnRampProviderCard {...mockProvider} />);

        fireEvent.click(screen.getByText('Select'));
        expect(mockProvider.handleDisclaimer).toHaveBeenCalled();
    });
});
