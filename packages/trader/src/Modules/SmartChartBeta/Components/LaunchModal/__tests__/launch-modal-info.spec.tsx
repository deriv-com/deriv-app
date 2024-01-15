import * as React from 'react';
import LaunchModalInfo from '../launch-modal-info';
import { render, screen } from '@testing-library/react';

describe('Launch Modal Info', () => {
    it('should render the component', () => {
        render(<LaunchModalInfo />);
        expect(screen.getByText('Smoother charts. Smarter insights.')).toBeInTheDocument();
    });
});
