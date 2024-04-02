import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PreferredCountriesSelector from '../PreferredCountriesSelector';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

const mockFn = jest.fn();
jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    useFormContext: () => ({
        formState: { errors: {}, isValid: true },
        getValues: jest.fn().mockReturnValue(['countryA']),
        setValue: mockFn,
    }),
}));

const mockProps = {
    countryList: {
        countryA: {
            country_name: 'countryA',
            cross_border_ads_enabled: 1,
            fixed_rate_adverts: 'enabled',
            float_rate_adverts: 'disabled',
            float_rate_offset_limit: 10,
            local_currency: 'CA',
            payment_methods: {
                alipay: {
                    display_name: 'Alipay',
                    fields: {
                        account: {
                            display_name: 'Alipay ID',
                            required: 1,
                            type: 'text',
                        },
                        instructions: {
                            display_name: 'Instructions',
                            required: 0,
                            type: 'memo',
                        },
                    },
                    type: 'ewallet',
                },
            },
        },
    },
    type: 'preferredCountries',
};

describe('PreferredCountriesSelector', () => {
    it('should render the component as expected with given props', () => {
        render(<PreferredCountriesSelector {...mockProps} />);
        expect(screen.getByText('All countries')).toBeInTheDocument();
        expect(screen.getByText('Preferred countries')).toBeInTheDocument();
    });
    it('should open the modal when the preferred countries field is clicked', () => {
        render(<PreferredCountriesSelector {...mockProps} />);
        const element = screen.getByText('All countries');
        userEvent.click(element);
        expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
    });
    it('should close the modal when the apply button is clicked', () => {
        render(<PreferredCountriesSelector {...mockProps} />);
        const element = screen.getByText('All countries');
        userEvent.click(element);
        const applyButton = screen.getByRole('button', { name: 'Apply' });
        userEvent.click(applyButton);
        expect(mockFn).toHaveBeenCalledWith('preferred-countries', ['countryA']);
        expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument();
    });
});
