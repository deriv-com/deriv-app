import React from 'react';
import { render, screen } from '@testing-library/react';
import { createPortal } from 'react-dom';
import { isMobile } from '@deriv/shared';
import Popup from '../popup.jsx';

jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: jest.fn(),
}));

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
}));

describe('<Popup />', () => {
    it('Component should be rendered properly in desktop view', () => {
        render(<Popup />);

        const el_dp2p_popup_container = screen.getByTestId('dp2p-popup_desktop-container');
        expect(el_dp2p_popup_container).toBeInTheDocument(el_dp2p_popup_container);
    });

    it('Portal must be created if component should be rendered in mobile view', () => {
        createPortal.mockReturnValueOnce(<div data-testid='dp2p-popup_mobile-container' />);
        isMobile.mockReturnValueOnce(true);
        render(<Popup />);

        const el_dp2p_popup_container = screen.getByTestId('dp2p-popup_mobile-container');
        expect(el_dp2p_popup_container).toBeInTheDocument();
    });
});
