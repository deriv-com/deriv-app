import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UnlinkAccountModal from '../unlink-account-modal';

describe('UnlinkAccountModal', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mock_props: React.ComponentProps<typeof UnlinkAccountModal> = {
        onClose: jest.fn(),
        is_open: true,
        identifier_title: 'Google',
        onClickSendEmail: jest.fn(),
    };

    it('should render modal body', () => {
        render(<UnlinkAccountModal {...mock_props} />);

        expect(
            screen.getByText(
                "To change your email address, you'll first need to unlink your email address from your Google account."
            )
        ).toBeInTheDocument();
    });

    it('should render 2 buttons', () => {
        render(<UnlinkAccountModal {...mock_props} />);

        expect(screen.getAllByRole('button')).toHaveLength(2);
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Unlink from Google')).toBeInTheDocument();
    });

    it('should invoke onClickSendEmail when clicking on Unlink button', () => {
        render(<UnlinkAccountModal {...mock_props} />);

        userEvent.click(screen.getByText('Unlink from Google'));
        expect(mock_props.onClickSendEmail).toHaveBeenCalledTimes(1);
        expect(mock_props.onClose).toHaveBeenCalledTimes(1);
    });

    it('should invoke onClose when clicking on Cancel button', () => {
        render(<UnlinkAccountModal {...mock_props} />);

        userEvent.click(screen.getByText('Cancel'));
        expect(mock_props.onClose).toHaveBeenCalled();
    });
});
