import React from 'react';
import { render, screen } from '@testing-library/react';
import AdRateError from '../AdRateError';

jest.mock('@deriv/api-v2', () => ({
    useAuthorize: () => ({
        data: {
            local_currencies: ['USD'],
        },
    }),
}));

describe('AdRateError', () => {
    it('should render the component as expected', () => {
        render(<AdRateError />);
        expect(
            screen.getByText(
                'Floating rates are enabled for USD. Ads with fixed rates will be deactivated. Switch to floating rates by 2024/12/31.'
            )
        );
    });

    //TODO: add test for other cases after implementation of floating rate hook
});
