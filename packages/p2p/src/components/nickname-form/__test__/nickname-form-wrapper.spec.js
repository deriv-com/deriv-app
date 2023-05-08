import React from 'react';
import { isMobile } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import NicknameFormWrapper from '../nickname-form-wrapper.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        general_store: { should_show_popup: true },
    })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
}));

jest.mock('@deriv/components', () => ({
    Modal: jest.fn(() => <div>Modal</div>),
}));

describe('<NicknameFormWrapper/>', () => {
    it('renders mobile view if isMobile is evaluted to true', () => {
        isMobile.mockImplementation(() => true);
        render(<NicknameFormWrapper />);
        expect(screen.getByTestId('mobile_nickname_form')).toBeInTheDocument();
    });

    it('renders the desktop view when isMobile is evaluated to false', () => {
        isMobile.mockReset();
        render(<NicknameFormWrapper />);
        expect(screen.getByText('Modal')).toBeInTheDocument();
        expect(screen.queryByTestId('mobile_nickname_form')).not.toBeInTheDocument();
    });
});
