import React from 'react';
import { render, screen } from '@testing-library/react';
import { TextContainer } from '../text-container';

describe('<TextContainer/>', () => {
    it('should contain "Lorem Ipsum" in the document', () => {
        render(
            <TextContainer children='Lorem Ipsum'/>
        );

        expect(screen.getByText(/Lorem Ipsum/i)).toBeInTheDocument();
    });

    it('should not contain "Lorem Ipsum" in the document but <TextContainer /> exist', () => {
        render(<TextContainer />);

        expect(screen.getByTestId(/dt_text_container/i)).toBeInTheDocument();
    });
});
