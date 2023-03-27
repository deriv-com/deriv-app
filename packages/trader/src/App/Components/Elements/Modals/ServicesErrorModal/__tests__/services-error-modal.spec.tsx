import React from 'react';
import { render, screen } from '@testing-library/react';
import ServicesErrorModal from '../services-error-modal';

jest.mock('../authorization-required-modal.jsx', () => jest.fn(() => 'AuthorizationRequiredModal'));
jest.mock('../insufficient-balance-modal.jsx', () => jest.fn(() => 'InsufficientBalanceModal'));
jest.mock('../company-wide-limit-exceeded-modal.jsx', () => jest.fn(() => 'CompanyWideLimitExceededModal'));
jest.mock('../account-verification-required-modal', () => jest.fn(() => 'AccountVerificationRequiredModal'));
type TModal = {
    (): JSX.Element;
    Body?: React.FC;
    Footer?: React.FC;
};
jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    const Modal: TModal = jest.fn(() => <div>Modal</div>);
    Modal.Body = jest.fn(() => <div />);
    Modal.Footer = jest.fn(() => <div />);
    return {
        ...original_module,
        Modal,
    };
});

describe('<ServicesErrorModel />', () => {
    it('Should return null if code or message is missing', () => {
        const onConfirm = jest.fn();
        const services_error_mock = {
            code: '',
            message: '',
            type: '',
        };
        const { container } = render(
            <ServicesErrorModal
                services_error={services_error_mock}
                is_logged_in
                is_virtual
                is_visible
                onConfirm={onConfirm}
            />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('AuthorizationRequiredModal should render when code is AuthorizationRequired', () => {
        const services_error_mock = {
            code: 'AuthorizationRequired',
            message: 'AuthorizationRequired',
        };
        const authorization_props = {
            is_logged_in: true,
            is_visible: true,
            onConfirm: jest.fn(),
        };
        render(<ServicesErrorModal services_error={services_error_mock} {...authorization_props} />);
        expect(screen.getByText('AuthorizationRequiredModal')).toBeInTheDocument();
    });

    it('InsufficientBalanceModal should render when code is InsufficientBalance', () => {
        const services_error_mock = {
            code: 'InsufficientBalance',
            message: 'InsufficientBalance',
        };
        const insufficient_balance_props = {
            is_virtual: true,
            is_visible: true,
            onConfirm: jest.fn(),
        };
        render(<ServicesErrorModal services_error={services_error_mock} {...insufficient_balance_props} />);
        expect(screen.getByText('InsufficientBalanceModal')).toBeInTheDocument();
    });

    it('CompanyWideLimitExceededModal should render when code is CompanyWideLimitExceeded', () => {
        const services_error_mock = {
            code: 'CompanyWideLimitExceeded',
            message: 'CompanyWideLimitExceeded',
        };
        const limit_exceeded_props = {
            is_visible: true,
            onConfirm: jest.fn(),
        };
        render(<ServicesErrorModal services_error={services_error_mock} {...limit_exceeded_props} />);
        expect(screen.getByText('CompanyWideLimitExceededModal')).toBeInTheDocument();
    });

    it('AccountVerificationRequiredModal should render when code is PleaseAuthenticate', () => {
        const services_error_mock = {
            code: 'PleaseAuthenticate',
            message: 'PleaseAuthenticate',
        };
        const account_verification_required_props = {
            is_visible: true,
            onConfirm: jest.fn(),
        };
        render(<ServicesErrorModal services_error={services_error_mock} {...account_verification_required_props} />);
        expect(screen.getByText('AccountVerificationRequiredModal')).toBeInTheDocument();
    });

    it('Default case should render when code is not specified in switch case', () => {
        const services_error_mock = {
            code: 'Default Error',
            message: 'Default Error',
            title: 'Default Error',
        };
        const default_case_props = {
            is_visible: true,
            onConfirm: jest.fn(),
        };
        render(<ServicesErrorModal services_error={services_error_mock} {...default_case_props} />);
        expect(screen.getByText('Modal')).toBeInTheDocument();
    });
});
