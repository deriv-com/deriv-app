import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultipliersExpirationModal from '../expiration-modal';

const mocked_props = {
    is_open: true,
    toggleModal: jest.fn(),
};

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Div100vhContainer: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('../expiration', () => jest.fn(() => 'Expiration Component'));

describe('<MultipliersExpirationModal />', () => {
    beforeAll(() => {
        (ReactDOM.createPortal as jest.Mock) = jest.fn(component => {
            return component;
        });
    });

    afterAll(() => {
        (ReactDOM.createPortal as jest.Mock).mockClear();
    });

    it('should render modal with a proper text', () => {
        render(<MultipliersExpirationModal {...mocked_props} />);

        expect(screen.getByText('Expiration')).toBeInTheDocument();
        expect(screen.getByText(/your contract will be closed automatically at the/i)).toBeInTheDocument();
        expect(screen.getByText('OK')).toBeInTheDocument();
    });
    it('should call toggleModal if user clicked on OK button', () => {
        render(<MultipliersExpirationModal {...mocked_props} />);

        userEvent.click(screen.getByText('OK'));

        expect(mocked_props.toggleModal).toBeCalled();
    });
});
