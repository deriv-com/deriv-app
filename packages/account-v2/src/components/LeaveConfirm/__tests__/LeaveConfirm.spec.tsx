import React from 'react';
import { Formik } from 'formik';
import { createBrowserHistory } from 'history';
import { Router, useHistory } from 'react-router-dom';
import { Modal } from '@deriv-com/ui';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeaveConfirm } from '../LeaveConfirm';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

afterEach(() => {
    jest.clearAllMocks();
});

let history: ReturnType<typeof useHistory>;

beforeEach(() => {
    history = createBrowserHistory();
});

describe('LeaveConfirm', () => {
    const onCancelMock = jest.fn();
    const onLeaveMock = jest.fn();

    const wrapper = ({ children }: { children: JSX.Element }) => {
        return (
            <Router history={history}>
                <Formik initialValues={{ name: '' }} onSubmit={jest.fn()}>
                    {({ handleBlur, handleChange, handleSubmit, values }) => (
                        <form onSubmit={handleSubmit}>
                            {children}
                            <input
                                aria-label='name'
                                name='name'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.name}
                            />
                        </form>
                    )}
                </Formik>
            </Router>
        );
    };

    const renderComponent = () => {
        render(<LeaveConfirm onCancel={onCancelMock} onLeave={onLeaveMock} />, { wrapper });
        const inputField = screen.getByRole('textbox');
        userEvent.type(inputField, 'Hello');

        act(() => {
            history.push('/something');
        });
    };

    Modal.setAppElement('body');

    const unsavedChangesText = 'Unsaved Changes';

    it('should render the component', async () => {
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText(unsavedChangesText)).toBeInTheDocument();
            expect(
                screen.getByText(
                    'You have unsaved changes. Are you sure you want to discard changes and leave this page?'
                )
            ).toBeInTheDocument();
        });
    });

    it('should call onCancel when Cancel button is clicked', async () => {
        renderComponent();

        const cancelButton = screen.getByLabelText('Cancel');
        userEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText(unsavedChangesText)).not.toBeInTheDocument();
            expect(onCancelMock).toHaveBeenCalled();
        });
    });

    it('should call onLeave when Leave Settings button is clicked', async () => {
        renderComponent();

        const leaveButton = screen.getByLabelText('Leave Settings');
        userEvent.click(leaveButton);

        await waitFor(() => {
            expect(screen.queryByText(unsavedChangesText)).not.toBeInTheDocument();
            expect(onLeaveMock).toHaveBeenCalled();
        });
    });
});
