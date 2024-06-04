import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DeactivateAccount from '../deactivate-account';

describe('<DeactivateAccount />', () => {
    it('should render DeactivateAccount component', () => {
        const { container } = render(
            <MemoryRouter>
                <DeactivateAccount />
            </MemoryRouter>
        );

        expect(container).toBeInTheDocument();
    });
});
