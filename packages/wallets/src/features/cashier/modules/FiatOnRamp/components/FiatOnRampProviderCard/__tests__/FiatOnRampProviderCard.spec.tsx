import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { fiatOnRampProvider as actualFiatOnRampProvider } from '../../../constants';
import FiatOnRampProviderCard from '../FiatOnRampProviderCard';

type MockedFiatOnRampProvider = typeof actualFiatOnRampProvider & {
    handleDisclaimer: jest.Mock;
};

jest.mock('../../../constants', () => ({
    fiatOnRampProvider: {
        description: 'Test Description',
        getPaymentIcons: jest.fn(() => [
            {
                icon: (
                    <div data-testid='test_icon' key='test-icon'>
                        Test Icon
                    </div>
                ),
                name: 'test_icon',
            },
        ]),
        handleDisclaimer: jest.fn(),
        icon: <div data-testid='test_logo'>Test Logo</div>,
        name: 'Test Provider',
    },
}));

describe('FiatOnRampProviderCard', () => {
    const fiatOnRampProvider = actualFiatOnRampProvider as MockedFiatOnRampProvider;

    it('should render component correctly', () => {
        render(<FiatOnRampProviderCard {...fiatOnRampProvider} />);

        expect(screen.getByText('Test Provider')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        const testIcons = screen.getAllByTestId('test_icon');
        expect(testIcons[0]).toBeInTheDocument();
        expect(screen.getByTestId('test_logo')).toBeInTheDocument();
        expect(screen.getByText('Select')).toBeInTheDocument();
    });

    it('should call handleDisclaimer function on "Select" button click', () => {
        render(<FiatOnRampProviderCard {...fiatOnRampProvider} />);

        fireEvent.click(screen.getByText('Select'));
        expect(fiatOnRampProvider.handleDisclaimer).toHaveBeenCalled();
    });
});
