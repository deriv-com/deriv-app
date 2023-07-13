import React from 'react';
import { screen, render } from '@testing-library/react';
import AdStatus from '../ad-status.jsx';

describe('<AdStatus />', () => {
    it('Component should show proper status if is_active prop is true', () => {
        render(<AdStatus is_active />);

        const el_active = screen.getByText('Active');
        expect(el_active).toBeInTheDocument();
    });

    it('Component should show proper status if is_active prop is false', () => {
        render(<AdStatus is_active={false} />);

        const el_inactive = screen.getByText('Inactive');
        expect(el_inactive).toBeInTheDocument();
    });
});
