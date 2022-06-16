import React from 'react';
import { render, screen } from '@testing-library/react';
import { UnlinkModal } from '../unlink-modal';

const modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal_root');
document.body.appendChild(modalRoot);

describe('<UnlinkModal />', () => {
    it('should show the proper messages', () => {
        render(<UnlinkModal identifier_title='title' is_open />);

        expect(screen.getByText('Are you sure you want to unlink from title?')).toBeInTheDocument();
        expect(screen.getByText('You will need to set a password to complete the process.')).toBeInTheDocument();
        expect(screen.getByText('Unlink from title')).toBeInTheDocument();
    });
});
