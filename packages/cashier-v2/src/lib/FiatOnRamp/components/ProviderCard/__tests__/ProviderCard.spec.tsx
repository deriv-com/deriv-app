import React from 'react';
import { render, screen } from '@testing-library/react';
import { fiatOnRampProviders } from '../../../constants/providers';
import ProviderCard from '../ProviderCard';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => false),
}));

jest.mock('../../../../../components', () => ({
    IconMarquee: jest.fn(() => <div>IconMarquee</div>),
}));

describe('ProviderCard', () => {
    let mockedProps: React.ComponentProps<typeof ProviderCard>;
    const banxaProvider = fiatOnRampProviders[0];

    beforeEach(() => {
        mockedProps = {
            handleDisclaimerDialog: jest.fn(),
            provider: banxaProvider,
        };
    });

    it('should render provider card with proper content', () => {
        render(<ProviderCard {...mockedProps} />);

        expect(screen.getByTestId('dt_logo')).toBeInTheDocument();
        expect(screen.getByText(banxaProvider.name)).toBeInTheDocument();
        expect(screen.getByText(banxaProvider.description)).toBeInTheDocument();
        expect(screen.getByText('IconMarquee')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
    });

    it('should trigger handleDisclaimerDialog when the user clicks on `Select` button', () => {
        render(<ProviderCard {...mockedProps} />);

        const selectButton = screen.getByRole('button', { name: 'Select' });
        userEvent.click(selectButton);

        expect(mockedProps.handleDisclaimerDialog).toHaveBeenCalledWith(true, 'banxa');
    });
});
