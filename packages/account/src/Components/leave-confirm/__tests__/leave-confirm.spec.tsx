import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik } from 'formik';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { isMobile } from '@deriv/shared';
import LeaveConfirm, { TransitionBlocker } from '../leave-confirm';

let modal_root_el: HTMLElement;

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

beforeAll(() => {
    modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'modal_root');
    document.body.appendChild(modal_root_el);
});

const mock_set_show = jest.fn();
const mock_set_next_location = jest.fn();
beforeEach(() => {
    jest.spyOn(React, 'useState')
        .mockImplementationOnce(() => [true, mock_set_show]) // TransitionBlockerComponent component uses this as show state
        .mockImplementationOnce(() => [true, mock_set_show]) // LeaveConfirm compoenent uses this as show state
        .mockImplementationOnce(() => [{ pathname: '/' }, mock_set_next_location]);
});

afterAll(() => {
    document.body.removeChild(modal_root_el);
});

const LeaveConfirmComponent = () => {
    const history = createBrowserHistory();
    return (
        <Router history={history}>
            <Formik initialValues={{}} enableReinitialize validate={jest.fn()} onSubmit={jest.fn()}>
                {() => <LeaveConfirm onDirty={jest.fn()} />}
            </Formik>
        </Router>
    );
};

const withRouter = Component => {
    const history = createBrowserHistory();
    const WrapperComponent = props => (
        <Router history={history}>
            <Component {...props} />
        </Router>
    );

    return WrapperComponent;
};

const TransitionBlockerComponent = withRouter(TransitionBlocker);

describe('LeaveConfirm', () => {
    it('should render LeaveConfirm component in desktop mode', () => {
        render(<LeaveConfirmComponent />);
        expect(
            screen.getByText('You have unsaved changes. Are you sure you want to discard changes and leave this page?')
        ).toBeInTheDocument();
    });
    it('should render LeaveConfirm component in mobile mode', () => {
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        render(<LeaveConfirmComponent />);
        expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    });
    it('should show proper icon', () => {
        render(<LeaveConfirmComponent />);
        expect(screen.getByTestId('unsaved_changes_icon')).toBeInTheDocument();
        expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
        expect(
            screen.getByText('You have unsaved changes. Are you sure you want to discard changes and leave this page?')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Leave Settings' })).toBeInTheDocument();
    });
    it('should trigger onclick callback when the user clicks cancel button', async () => {
        render(<LeaveConfirmComponent />);
        const el_cancel_btn = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(el_cancel_btn);

        expect(mock_set_show).toHaveBeenCalled();
        expect(mock_set_next_location).toHaveBeenCalled();
    });
    it('should set values as dirty when the user leaves modal', () => {
        render(<TransitionBlockerComponent onDirty={jest.fn()} />);
        const el_cancel_btn = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(el_cancel_btn);
        expect(screen.getByRole('button', { name: 'Leave Settings' })).toBeInTheDocument();
    });
    it('should change pathname when user leaves form', () => {
        render(<TransitionBlockerComponent />);
        const el_leave_settings_btn = screen.getByRole('button', { name: 'Leave Settings' });
        fireEvent.click(el_leave_settings_btn);
        expect(screen.getByRole('button', { name: 'Leave Settings' })).toBeInTheDocument();
    });
});
