import React from 'react';
import { screen, render } from '@testing-library/react';
import IconWithNoteInline from '../icon-with-note-inline';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => 'mockedIcon'),
    };
});
describe('<IconWithNoteInline />', () => {
    const props = {
        icon: 'string',
        message: 'test message',
    };

    it('should render the IconWithNoteInline component', () => {
        render(<IconWithNoteInline {...props} />);
        expect(screen.getByText('mockedIcon')).toBeInTheDocument();
        expect(screen.getByText('test message')).toBeInTheDocument();
    });
});
