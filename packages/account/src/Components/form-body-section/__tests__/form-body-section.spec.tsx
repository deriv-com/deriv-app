import React from 'react';

import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';

import FormBodySection, { TFormBodySection } from '../form-body-section';

const MockFormBodySection = (props: TFormBodySection) => {
    const mock_store = mockStore({});
    return (
        <StoreProvider store={mock_store}>
            <FormBodySection {...props}>
                <p>Lorem Ipsum</p>
            </FormBodySection>
        </StoreProvider>
    );
};

describe('Test coverage for FormBodySection component', () => {
    it('Should render children', () => {
        render(<MockFormBodySection />);
        expect(screen.getByText('Lorem Ipsum')).toBeInTheDocument();
    });

    it('When we pass "has_side_note" property, it should render a different ui', () => {
        render(<MockFormBodySection has_side_note />);
        expect(screen.getByTestId('dt_side_note_container')).toBeInTheDocument();
    });

    it('When "side_note" value is string, it should render inside Text component', () => {
        const test_side_note = 'this is a test';
        render(<MockFormBodySection has_side_note side_note={test_side_note} />);
        expect(screen.getByTestId('dt_side_note_text')).toHaveTextContent(test_side_note);
    });

    it('When "side_note" value is not string, it should not render inside Text component', () => {
        const test_side_note = <div>test side note component</div>;
        render(<MockFormBodySection has_side_note side_note={test_side_note} type='image' />);
        expect(screen.getByText('test side note component')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_side_note_text')).not.toBeInTheDocument();
    });
});
