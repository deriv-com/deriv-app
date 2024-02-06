import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UrlUnavailableModal from '../url-unavailable-modal';

describe('<UrlUnavailableModal />', () => {
    let modalRootEl: HTMLDivElement;

    beforeAll(() => {
        modalRootEl = document.createElement('div');
        modalRootEl.setAttribute('id', 'modal_root');
        document.body.appendChild(modalRootEl);
    });

    afterAll(() => {
        document.body.removeChild(modalRootEl);
    });

    const modalHeading = /The URL you requested/i;
    const modalInfo = /This could be because:/i;
    const okButtonName = 'OK';

    const mockProps: React.ComponentProps<typeof UrlUnavailableModal> = {
        isVisible: true,
        onConfirm: jest.fn(),
        isMobile: false,
    };

    it('should render UrlUnavailableModal if is_visible is true', () => {
        render(<UrlUnavailableModal {...mockProps} />);
        expect(screen.getByRole('heading', { name: modalHeading })).toBeInTheDocument();
        expect(screen.getByText(modalInfo)).toBeInTheDocument();

        const okButton = screen.getByRole('button', { name: okButtonName });
        expect(okButton).toBeInTheDocument();
        expect(okButton).toBeEnabled();
    });
    it('should call onConfirm when OK button is clicked', () => {
        render(<UrlUnavailableModal {...mockProps} />);
        const okButton = screen.getByRole('button', { name: okButtonName });
        userEvent.click(okButton);
        expect(mockProps.onConfirm).toBeCalledTimes(1);
    });
    it('should not render the component if isVisible is false', () => {
        render(<UrlUnavailableModal {...mockProps} isVisible={false} />);
        expect(screen.queryByRole('heading', { name: modalHeading })).not.toBeInTheDocument();
        expect(screen.queryByText(modalInfo)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: okButtonName })).not.toBeInTheDocument();
    });
});
