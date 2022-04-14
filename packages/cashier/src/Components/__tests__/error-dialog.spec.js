import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { __esModule } from '@babel/preset-typescript';
import ErrorDialog from '../error-dialog';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedConnect',
    connect: () => Component => Component,
}));
describe('<ErrorDialog />', () => {
    const props = {
        confirm_button_text: '',
        error_message: 'This is the error message.',
        has_no_close_icon: true,
        reset: jest.fn(),
        setShouldShow: jest.fn(),
        should_show: true,
        should_not_show_title: false,
    };
    it('should show the error component if error and trigger onClick callback when the client clicks Retry button', () => {
        render(<ErrorDialog {...props} />);
        expect(screen.getByText('This is the error message.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
        expect(props.setShouldShow).toBeCalled();
    });
    it('should invoke reset function', () => {
        render(<ErrorDialog {...props} should_show={false} />);
        expect(props.reset).toHaveBeenCalled();
    });

    it('should close the dialog', () => {
        const { container } = render(<ErrorDialog {...props} />);
        fireEvent.keyDown(container, {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            charCode: 27,
        });
        expect(props.setShouldShow).toHaveBeenCalledTimes(1);
    });
});
