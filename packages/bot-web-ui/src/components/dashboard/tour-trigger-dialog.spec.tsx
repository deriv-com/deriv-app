import React from 'react';
import { render, screen } from '@testing-library/react';
import { mocked_props } from './dashboard-component/__tests__/dashboard-component.spec';
import TourTriggrerDialog from './tour-trigger-dialog';

const mock_connect_props = {
    dialog_options: {
        title: 'string',
        message: 'string',
        ok_button_text: 'string',
        cancel_button_text: 'string',
    },
    setStrategySaveType: jest.fn(),
};

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect:
        () =>
        <T,>(Component: T) =>
        props =>
            Component({ ...props, ...mock_connect_props }),
}));

describe('<TourTriggrerDialog />', () => {
    it('renders tour trigger dialog', () => {
        render(<TourTriggrerDialog {...mocked_props} />);
        expect(screen.getByText(/Get started on Deriv Bot/i)).toBeInTheDocument();
    });
});
