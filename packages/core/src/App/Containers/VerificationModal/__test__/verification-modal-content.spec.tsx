import React from 'react';
import { render, screen } from '@testing-library/react';
import VerificationModalContent from '../verification-modal-content';
import { StoreProvider, mockStore } from '@deriv/stores';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/account/src/Sections/Verification/ProofOfIdentity/proof-of-identity-container', () =>
    jest.fn(props => (
        <div>
            <div>ProofOfIdentityContainer</div>
            <button onClick={props.onSubmit}>Next</button>
        </div>
    ))
);

jest.mock('@deriv/account/src/Sections/Verification/ProofOfAddress/proof-of-address-container', () =>
    jest.fn(props => (
        <div>
            <div>ProofOfAddressContainer</div>
            <button onClick={props.nextStep}>Next</button>
        </div>
    ))
);

const getByTextFn = (text: string, should_be: boolean) => {
    if (should_be) {
        expect(screen.getByText(text)).toBeInTheDocument();
    } else {
        expect(screen.queryByText(text)).not.toBeInTheDocument();
    }
};

const testAllStepsFn = (steps: { body: string }[], step_no: number) => {
    steps.forEach((step, index) => {
        if (index === step_no) {
            getByTextFn(step.body, true);
        } else {
            getByTextFn(step.body, false);
        }
    });
};

const steps = [
    {
        body: 'ProofOfIdentityContainer',
    },
    {
        body: 'ProofOfAddressContainer',
    },
];

describe('<VerificationModalContent />', () => {
    const mock_store = mockStore({
        client: {
            authentication_status: {
                identity_status: 'none',
                document_status: 'none',
            },
        },
    });

    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const mock_props = {
        onFinish: jest.fn(),
    };

    it('should render VerificationModalContent component', () => {
        render(
            <StoreProvider store={mock_store}>
                <VerificationModalContent {...mock_props} />
            </StoreProvider>
        );

        expect(screen.getByTestId('dt_verification_modal_body')).toBeInTheDocument();
    });

    it('should render properly for the first step content', () => {
        render(
            <StoreProvider store={mock_store}>
                <VerificationModalContent {...mock_props} />
            </StoreProvider>
        );

        testAllStepsFn(steps, 0);
    });

    it('should render properly for the second step content', async () => {
        const { rerender } = render(
            <StoreProvider store={mock_store}>
                <VerificationModalContent {...mock_props} />
            </StoreProvider>
        );
        const next_button = screen.getByRole('button', { name: 'Next' });
        expect(next_button).toBeInTheDocument();
        userEvent.click(next_button);

        rerender(
            <StoreProvider store={mock_store}>
                <VerificationModalContent {...mock_props} />
            </StoreProvider>
        );

        testAllStepsFn(steps, 1);
    });
});
