import React from 'react';
import { render, screen } from '@testing-library/react';
import { TUnlinkModal, UnlinkModal } from '../unlink-modal';

const modalRoot: HTMLDivElement = document.createElement('div');
modalRoot.setAttribute('id', 'modal_root');
document.body.appendChild(modalRoot);

describe('<UnlinkModal />', () => {
    const mock_props: TUnlinkModal = {
        identifier_title: 'test title',
        is_open: true,
        onClose: jest.fn(),
        onClickSendEmail: jest.fn(),
    };

    it('should show the proper messages', () => {
        render(<UnlinkModal {...mock_props} />);

        expect(screen.getByText('Are you sure you want to unlink from test title?')).toBeInTheDocument();
        expect(screen.getByText('You will need to set a password to complete the process.')).toBeInTheDocument();
        expect(screen.getByText('Unlink from test title')).toBeInTheDocument();
    });
});
