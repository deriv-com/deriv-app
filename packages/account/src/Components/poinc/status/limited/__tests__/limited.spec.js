import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { PoincLimited } from '../limited';

describe('<PoincLimited/>', () => {
    it('should render PoincLimited component', () => {
        render(<PoincLimited />);
        expect(screen.getByText(/you've reached the limit for uploading your documents/i)).toBeInTheDocument();
        expect(screen.getByText(/please check your email inbox for more details/i)).toBeInTheDocument();
    });
});
