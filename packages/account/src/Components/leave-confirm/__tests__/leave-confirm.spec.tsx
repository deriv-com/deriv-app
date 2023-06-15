import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LeaveConfirm, { TransitionBlockerWithRouter } from '../leave-confirm';
import { Formik } from 'formik';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { isMobile } from '@deriv/shared';

let modal_root_el;

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

const LeaveConfirmComponent = () => {
    const history = createBrowserHistory();
    return (
        <Router history={history}>
            <Formik>
                <LeaveConfirm onDirty={jest.fn()} />
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

const TransitionBlockerComponent = withRouter(TransitionBlockerWithRouter);

describe('LeaveConfirm', () => {
    it('should render LeaveConfirm component in desktop mode', () => {
        jest.spyOn(React, 'useState').mockReturnValueOnce([true, () => null]);
        render(<LeaveConfirmComponent />);
        expect(
            screen.getByText('You have unsaved changes. Are you sure you want to discard changes and leave this page?')
        ).toBeInTheDocument();
    });
    it('should render LeaveConfirm component in mobile mode', () => {
        jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState(true));
        isMobile.mockReturnValueOnce(true);
        render(<LeaveConfirmComponent />);
        expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    });
    it('should show proper icon', () => {
        jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState(true));

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
        jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState(true));
        render(<LeaveConfirmComponent />);
        const el_cancel_btn = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(el_cancel_btn);
        await waitFor(() => {
            expect(screen.queryByText('Unsaved changes')).not.toBeInTheDocument();
        });
    });
    it('should set values as dirty when the user leaves modal', () => {
        jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState(true));
        render(<TransitionBlockerComponent onDirty={jest.fn()} />);
        const el_cancel_btn = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(el_cancel_btn);
        expect(screen.getByRole('button', { name: 'Leave Settings' })).toBeInTheDocument();
    });
    it('should change pathname when user leaves form', () => {
        jest.spyOn(React, 'useState')
            .mockReturnValueOnce([true, () => null])
            .mockReturnValueOnce([{ pathname: '/' }, () => null]);
        render(<TransitionBlockerComponent />);
        const el_leave_settings_btn = screen.getByRole('button', { name: 'Leave Settings' });
        fireEvent.click(el_leave_settings_btn);
        expect(screen.getByRole('button', { name: 'Leave Settings' })).toBeInTheDocument();
    });
});
