import React from 'react';
import { screen, render } from '@testing-library/react';
import InlineFullWidthNoteWithIcon from '../inline-full-width-note-with-icon';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => 'mockedIcon'),
    };
});
describe('<InlineFullWidthNoteWithIcon />', () => {
    const props = {
        icon: 'string',
        message: 'test message',
        title: 'test title',
    };

    it('should render the InlineFullWidthNoteWithIcon component', () => {
        render(<InlineFullWidthNoteWithIcon {...props} />);
        expect(screen.getByText('mockedIcon')).toBeInTheDocument();
        expect(screen.getByText(/test message/i)).toBeInTheDocument();
        expect(screen.getByText(/test title/i)).toBeInTheDocument();
    });
});
