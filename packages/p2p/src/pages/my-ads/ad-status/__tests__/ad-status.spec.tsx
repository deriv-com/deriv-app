import React from 'react';
import { render, screen } from '@testing-library/react';
import AdStatus from '../ad-status';

describe('<AdStatus/>', () => {
    it('should render component is inactive when ad is inactive', () => {
        render(<AdStatus is_active={false} />);

        expect(screen.getByText('Inactive')).toBeInTheDocument();
    });
    it('should render component as active when ad is active', () => {
        render(<AdStatus is_active />);

        expect(screen.getByText('Active')).toBeInTheDocument();
    });
});
