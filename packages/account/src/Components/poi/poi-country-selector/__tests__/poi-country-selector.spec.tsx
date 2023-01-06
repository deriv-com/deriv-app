import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { isDesktop, isMobile } from '@deriv/shared';
import CountrySelector from '../poi-country-selector';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));

describe('<CountrySelector/>', () => {
    let mock_props = {
        handleSelectionNext: jest.fn(),
        is_from_external: false,
        residence_list: [{ value: '', text: '' }],
        selected_country: '',
        setSelectedCountry: jest.fn(),
    };

    beforeEach(() => {
        mock_props = {
            handleSelectionNext: jest.fn(),
            is_from_external: false,
            residence_list: [
                { value: 'Country 1', text: 'Country 1' },
                { value: 'Country 2', text: 'Country 2' },
                { value: 'Country 3', text: 'Country 3' },
            ],
            selected_country: '',
            setSelectedCountry: jest.fn(),
        };
    });

    it('should render CountrySelector component external', () => {
        mock_props.is_from_external = true;

        render(<CountrySelector {...mock_props} />);

        expect(screen.getByText('Proof of identity')).toBeInTheDocument();
        expect(screen.getByText('In which country was your document issued?')).toBeInTheDocument();
        expect(screen.getByText('Country')).toBeInTheDocument();

        expect(screen.getByTestId('dt_external_dropdown')).toBeInTheDocument();
    });

    it('should show error message after clicking the input without choosing the country', async () => {
        render(<CountrySelector {...mock_props} />);

        const field = screen.getByLabelText('Country');
        const next_btn = screen.getByRole('button');

        expect(field).toBeInTheDocument();
        expect(screen.queryByText(/please select a valid country of document issuance/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/please select the country of document issuance/i)).not.toBeInTheDocument();

        fireEvent.blur(field);
        expect(await screen.findByText(/please select the country of document issuance/i)).toBeInTheDocument();
        expect(next_btn).toBeDisabled();

        fireEvent.change(field, { target: { value: 'invalid country' } });
        expect(await screen.findByText(/please select a valid country of document issuance/i)).toBeInTheDocument();
        expect(next_btn).toBeDisabled();
    });

    it('should trigger selection functions and next button', async () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);
        mock_props.selected_country = 'Country 2';

        render(<CountrySelector {...mock_props} />);

        const field = screen.getByRole('combobox');

        fireEvent.change(field, { target: { value: 'Country 2' } });

        const next_btn = screen.getByRole('button');
        expect(next_btn).toBeEnabled();
        expect(mock_props.setSelectedCountry).toHaveBeenCalledTimes(1);

        fireEvent.click(next_btn);
        await waitFor(() => {
            expect(mock_props.handleSelectionNext).toHaveBeenCalledTimes(1);
        });
    });
});
