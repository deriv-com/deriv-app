import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingModal from '../loading-modal';

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    useModalManagerContext: () => ({
        is_modal_open: true,
    }),
}));

describe('<LoadingModal />', () => {
    let modal_root_el: HTMLElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });
    it('should render loading modal', () => {
        render(<LoadingModal />);
        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });
});
