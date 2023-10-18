import React from 'react';
import { render, screen } from '@testing-library/react';
import { PoincLimited } from '../limited';

describe('<PoincLimited/>', () => {
    it('should render PoincLimited component', () => {
        render(<PoincLimited />);
        expect(screen.getByText(/limit reached/i)).toBeInTheDocument();
        expect(screen.getByText(/please check the email we've sent you for further information/i)).toBeInTheDocument();
    });
});
