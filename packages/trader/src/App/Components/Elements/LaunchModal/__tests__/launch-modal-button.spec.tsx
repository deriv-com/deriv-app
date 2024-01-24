import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LaunchModalButton from '../launch-modal-button';

const default_props = {
    handleOpen: jest.fn(),
    setShowDescription: jest.fn(),
};

const confirm_button = 'Ok';
const learn_more_button = 'Learn more';

describe('<LaunchModalButton />', () => {
    it('should render LaunchModalButton', () => {
        render(<LaunchModalButton {...default_props} />);

        expect(screen.getByText(confirm_button)).toBeInTheDocument();
        expect(screen.getByText(learn_more_button)).toBeInTheDocument();
    });

    it('should call only handleOpen function if user click on OK button', () => {
        render(<LaunchModalButton {...default_props} />);

        userEvent.click(screen.getByText(confirm_button));
        expect(default_props.handleOpen).toBeCalled();
        expect(default_props.setShowDescription).not.toBeCalled();
    });

    it('should call both handleOpen and setShowDescription function if user click on Learn more button', () => {
        render(<LaunchModalButton {...default_props} />);

        userEvent.click(screen.getByText(learn_more_button));
        expect(default_props.handleOpen).toBeCalled();
        expect(default_props.setShowDescription).toBeCalled();
    });
});
