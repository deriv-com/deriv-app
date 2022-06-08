import React from 'react';
import { render, screen } from '@testing-library/react';
import { TextContainer } from '../text-container';

const MockTextContainer = props => {
    return (
        <TextContainer>
            <p>{props.text}</p>
        </TextContainer>
    )
}

describe('<TextContainer/>', () => {
    describe('renders the <TextContainer />', () => {
        beforeEach(() => {
            render(<MockTextContainer text="Lorem Ipsum"/>);
        });

        it('should contain "Lorem Ipsum" in the document', () => {
            expect(screen.getByText(/Lorem Ipsum/i)).toBeInTheDocument()
        });
    });
    describe('renders the <TextContainer /> without any input', () => {
        beforeEach(() => {
            render(<MockTextContainer />);
        });

        it('should not contain "Lorem Ipsum" in the document but <TextContainer /> exist', () => {
            expect(screen.getByTestId(/test_text_container/i)).toBeInTheDocument()
        });
    })
});
