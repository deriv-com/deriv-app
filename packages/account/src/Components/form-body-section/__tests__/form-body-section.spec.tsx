import React from 'react';
import { screen, render } from '@testing-library/react';
import FormBodySection, { TFormBodySection } from '../form-body-section';

const MockFormBodySection = (props: TFormBodySection) => {
    return (
        <FormBodySection {...props}>
            <p>Lorem Ipsum</p>
        </FormBodySection>
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
        expect(screen.getByTestId('side-note-text')).toHaveTextContent(test_side_note);
    });

    it('When "side_note" value is not string, it should not render inside Text component', () => {
        const test_side_note = <div>test side note component</div>;
        render(<MockFormBodySection has_side_note side_note={test_side_note} />);
        expect(screen.getByText('test side note component')).toBeInTheDocument();
        expect(screen.queryByTestId('side-note-text')).not.toBeInTheDocument();
    });
});
