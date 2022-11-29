import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Expired from '../expired';

describe('<Expired />', () => {
    const mock_props = {
        handleRequireSubmission: jest.fn(),
        is_from_external: false,
        redirect_button: <div>Redirect Button</div>,
    };

    it('should render "Expired" window with redirect button', () => {
        render(<Expired {...mock_props} />);

        expect(screen.getByText('New proof of identity document needed')).toBeInTheDocument();
        expect(screen.getByText('Redirect Button')).toBeInTheDocument();
        expect(screen.getByText('Upload Document')).toBeInTheDocument();
    });

    it('should render "Expired" window without redirect button', () => {
        mock_props.is_from_external = true;

        render(<Expired {...mock_props} />);

        expect(screen.getByText('New proof of identity document needed')).toBeInTheDocument();
        expect(screen.getByText('Upload Document')).toBeInTheDocument();
        expect(screen.queryByText('Redirect Button')).not.toBeInTheDocument();
    });

    it('should trigger callback after clicking on the "Upload Document" button', () => {
        const mockOnClick = mock_props.handleRequireSubmission;

        render(<Expired {...mock_props} />);

        const btn = screen.getByRole('button');
        expect(btn).toHaveClass('account-management__continue');

        fireEvent.click(btn);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
