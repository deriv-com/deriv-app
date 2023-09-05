import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserGuide from '../user-guide';
import { mocked_props } from './dashboard-component.spec';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Cards: jest.fn(() => 'Cards'),
        messageWithButton: jest.fn(() => 'messageWithButton'),
        arrayAsMessage: jest.fn(() => 'messageWithButton'),
        DesktopWrapper: jest.fn(() => 'DesktopWrapper'),
        MobileWrapper: jest.fn(() => 'MobileWrapper'),
        Text: jest.fn(() => 'Text'),
    };
});
describe('<UserGuide />', () => {
    it('renders user guide button', () => {
        render(<UserGuide {...mocked_props} />);
        const use_guide_button = screen.getByTestId('btn-user-guide');
        userEvent.click(use_guide_button);
        expect(screen.getByTestId('btn-user-guide')).toBeInTheDocument();
    });
});
