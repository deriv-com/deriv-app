import React from 'react';
import { render, screen } from '@testing-library/react';
import SelfExclusionForm from '../self-exclusion-form';
import SelfExclusionContext from '../self-exclusion-context';

jest.mock('../self-exclusion-confirm-page', () => () => <div>SelfExclusionConfirmPage</div>);
jest.mock('../self-exclusion-inputs', () => () => <div>SelfExclusionInputs</div>);

describe('<SelfExclusionForm />', () => {
    let mockContext = {};

    beforeEach(() => {
        mockContext = {
            state: {
                self_exclusions: {},
                is_confirm_page: false,
            },
            validateFields: jest.fn(),
            handleSubmit: jest.fn(),
        };
    });
    it('should render SelfExclusionForm component with SelfExclusionInputs', () => {
        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionForm />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('SelfExclusionInputs')).toBeInTheDocument();
        expect(screen.queryByText('SelfExclusionConfirmPage')).not.toBeInTheDocument();
    });

    it('should render SelfExclusionForm component with SelfExclusionConfirmPage', () => {
        mockContext.state.is_confirm_page = true;

        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionForm />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('SelfExclusionConfirmPage')).toBeInTheDocument();
        expect(screen.queryByText('SelfExclusionInputs')).not.toBeInTheDocument();
    });
});
