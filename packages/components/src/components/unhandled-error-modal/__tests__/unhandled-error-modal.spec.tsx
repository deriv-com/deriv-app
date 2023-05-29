import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UnhandledErrorModal from '../unhandled-error-modal';

describe('<UnhandledErrorModal />', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('renders the component with proper messages', () => {
        jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState<boolean>(true));
        render(<UnhandledErrorModal />);
        expect(screen.getByText(/Sorry for the interruption/i)).toBeInTheDocument();
        expect(screen.getByText(/Our servers hit a bump. Let’s refresh to move on./i)).toBeInTheDocument();
        expect(screen.getByText('Refresh')).toBeInTheDocument();
    });

    it('should call reload function when refresh button is clicked', () => {
        jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState<boolean>(true));
        const reloadFn = jest.fn();
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: reloadFn },
        });
        render(<UnhandledErrorModal />);
        fireEvent.click(screen.getByText('Refresh'));
        expect(reloadFn).toHaveBeenCalled();
    });
});
