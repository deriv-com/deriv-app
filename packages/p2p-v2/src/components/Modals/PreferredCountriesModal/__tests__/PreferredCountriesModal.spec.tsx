import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import PreferredCountriesModal from '../PreferredCountriesModal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

const mockUseDevice = useDevice as jest.Mock;
const mockProps = {
    countryList: [{ text: 'text', value: 'value' }],
    isModalOpen: true,
    onClickApply: jest.fn(),
    onRequestClose: jest.fn(),
    selectedCountries: ['value'],
    setSelectedCountries: jest.fn(),
};

describe('PreferredCountriesModal', () => {
    it('should render the component as expected', () => {
        render(<PreferredCountriesModal {...mockProps} />);
        expect(screen.getByText('Preferred countries')).toBeInTheDocument();
    });
    it('should render the full page mobile wrapper when isMobile is true', () => {
        mockUseDevice.mockReturnValue({ isMobile: true });
        render(<PreferredCountriesModal {...mockProps} />);
        expect(screen.getByTestId('dt_p2p_v2_full_page_mobile_wrapper')).toBeInTheDocument();
        expect(screen.getByText('Preferred countries')).toBeInTheDocument();
    });
    it('should handle onClickClear in full page view', () => {
        render(<PreferredCountriesModal {...mockProps} />);
        const clearButton = screen.getByRole('button', { name: 'Clear' });
        clearButton.click();
        expect(mockProps.setSelectedCountries).toHaveBeenCalledWith([]);
    });
    it('should handle onClickClear in modal view', () => {
        mockUseDevice.mockReturnValue({ isMobile: false });
        render(<PreferredCountriesModal {...mockProps} />);
        const clearButton = screen.getByRole('button', { name: 'Clear' });
        clearButton.click();
        expect(mockProps.setSelectedCountries).toHaveBeenCalledWith([]);
    });
});
