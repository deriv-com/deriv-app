import React from 'react';
import StaticGetMoreAccounts from '../static-get-more-accounts';
import { render, screen } from '@testing-library/react';

describe('GetMoreAccounts', () => {
    const mock_props = {
        description: 'description',
        icon: 'icon',
        title: 'title',
    };

    it('should render title, description and icon', () => {
        render(<StaticGetMoreAccounts {...mock_props} />);
        expect(screen.getByText('description')).toBeInTheDocument();
        expect(screen.getByText('title')).toBeInTheDocument();
        const icon_component = screen.getByTestId('dt_icon');
        expect(icon_component).toHaveClass('static-get-more-accounts__icon');
    });
});
