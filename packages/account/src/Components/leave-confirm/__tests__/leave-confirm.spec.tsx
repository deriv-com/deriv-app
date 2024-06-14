import React from 'react';
import { render, screen } from '@testing-library/react';
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

afterAll(() => {
    document.body.removeChild(modal_root_el);
});

const mock_set_show = jest.fn();
const mock_set_next_location = jest.fn();

const get_leave_confirm_states = () => {
    return jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [null, jest.fn()])
        .mockImplementationOnce(() => [true, mock_set_show])
        .mockImplementationOnce(() => [{ pathname: '/' }, mock_set_next_location]);
};

const get_transition_blocker_states = ({ pathname }: { pathname: string | null }) => {
    return jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [true, mock_set_show])
        .mockImplementationOnce(() => [pathname ? { pathname: '/' } : null, mock_set_next_location]);
};

const on_dirty = jest.fn();

const LeaveConfirmComponent = () => {
    const history = createBrowserHistory();
    return (
        <Router history={history}>
            <Formik initialValues={{ field: '' }} enableReinitialize validate={jest.fn()} onSubmit={jest.fn()}>
                {() => {
                    return <LeaveConfirm onDirty={on_dirty()} />;
                }}
            </Formik>
        </Router>
    );
};

// @ts-expect-error [TODO]: Fix type for error
const withRouter = Component => {
    const history = createBrowserHistory();
    // @ts-expect-error [TODO]: Fix type for error
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
        get_leave_confirm_states();
        render(<LeaveConfirmComponent />);
        expect(
            screen.getByText('You have unsaved changes. Are you sure you want to discard changes and leave this page?')
        ).toBeInTheDocument();
    });
    it('should render LeaveConfirm component in mobile mode', () => {
        get_leave_confirm_states();
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        render(<LeaveConfirmComponent />);
        expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    });
    it('should show proper icon', () => {
        get_leave_confirm_states();
        render(<LeaveConfirmComponent />);
        expect(screen.getByTestId('dt_unsaved_changes_icon')).toBeInTheDocument();
        expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
        expect(
            screen.getByText('You have unsaved changes. Are you sure you want to discard changes and leave this page?')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Leave Settings' })).toBeInTheDocument();
    });
    it('should trigger onclick callback when the user clicks cancel button', async () => {
        get_leave_confirm_states();
        render(<LeaveConfirmComponent />);
        const el_cancel_btn = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(el_cancel_btn);

        expect(mock_set_show).toHaveBeenCalled();
        expect(mock_set_next_location).toHaveBeenCalled();
    });
    it('should sehow modal when value is dirty and trigger unblock function', () => {
        get_transition_blocker_states({ pathname: '/' });
        render(<TransitionBlockerComponent dirty onDirty={on_dirty} />);
        const el_leave_settings_btn = screen.getByRole('button', { name: 'Leave Settings' });
        userEvent.click(el_leave_settings_btn);

        expect(on_dirty).toHaveBeenCalled();
        expect(mock_set_show).toHaveBeenCalled();
        expect(mock_set_next_location).toHaveBeenCalled();
    });

    it('should set values as dirty when the user leaves modal', () => {
        get_transition_blocker_states({ pathname: '/' });
        render(<TransitionBlockerComponent onDirty={on_dirty} />);
        const el_cancel_btn = screen.getByRole('button', { name: 'Cancel' });
        userEvent.click(el_cancel_btn);

        expect(on_dirty).toHaveBeenCalled();
    });
    it('should change pathname when user leaves form', () => {
        get_transition_blocker_states({ pathname: '/' });
        render(<TransitionBlockerComponent />);
        const el_leave_settings_btn = screen.getByRole('button', { name: 'Leave Settings' });
        userEvent.click(el_leave_settings_btn);
        expect(screen.getByRole('button', { name: 'Leave Settings' })).toBeInTheDocument();
    });

    it('should not change pathname when user leaves form', () => {
        get_transition_blocker_states({ pathname: null });
        render(<TransitionBlockerComponent />);
        const el_leave_settings_btn = screen.getByRole('button', { name: 'Leave Settings' });
        userEvent.click(el_leave_settings_btn);
        expect(screen.getByRole('button', { name: 'Leave Settings' })).toBeInTheDocument();
    });
});
