import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DeactivateAccount from '../deactivate-account'; // Adjust the import path based on your project structure

describe('<DeactivateAccount />', () => {
    it('should run DeactivateAccount component', () => {
        const { container } = render(
            <MemoryRouter>
                <DeactivateAccount />
            </MemoryRouter>
        );

        expect(container).toBeInTheDocument();
    });
});
