import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CFDServerErrorDialog from '../cfd-server-error-dialog';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<CFDServerErrorDialog /> ', () => {
    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mock_props = {
        clearCFDError: jest.fn(),
        error_type: 'error_type',
        has_cfd_error: true,
        is_cfd_success_dialog_enabled: false,
        error_message: 'Sorry, an error occured while processing your request.',
    };

    it('should render the component properly', () => {
        const { container } = render(<CFDServerErrorDialog {...mock_props} />);
        expect(container.firstChild).toHaveClass('dc-dialog__wrapper dc-dialog__wrapper--enter');
    });

    it('should render the proper text and error message', () => {
        render(<CFDServerErrorDialog {...mock_props} />);
        expect(screen.getByText(/Sorry, an error occured while processing your request/i)).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('OK');
        expect(screen.getByRole('heading')).toHaveTextContent(/Something’s not right/i);
    });

    it('should not render the component if has_cfd_error is false', () => {
        render(<CFDServerErrorDialog {...mock_props} has_cfd_error={false} />);
        expect(screen.queryByText(/Sorry, an error occured while processing your request/i)).not.toBeInTheDocument();
    });

    it('should not render the component if is_cfd_success_dialog_enabled', () => {
        render(<CFDServerErrorDialog {...mock_props} is_cfd_success_dialog_enabled />);
        expect(screen.queryByText(/Sorry, an error occured while processing your request/i)).not.toBeInTheDocument();
    });

    it('should clear the component if OK is clicked', () => {
        render(<CFDServerErrorDialog {...mock_props} />);
        const ok_btn = screen.getByRole('button', { name: /OK/i });
        fireEvent.click(ok_btn);
        expect(mock_props.clearCFDError).toHaveBeenCalled();
    });
});
