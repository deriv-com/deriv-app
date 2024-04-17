import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from '../Accordion';

describe('Accordion', () => {
    it('should render header and content', () => {
        render(
            <Accordion icon='' title='Title'>
                <p>Content</p>
            </Accordion>
        );

        expect(screen.getByText('Title')).toBeVisible();
        expect(screen.getByTestId('dt_expanded_content')).toHaveClass('max-h-0 overflow-hidden');
    });

    it('should expand content when clicked', () => {
        render(
            <Accordion icon='' title='Title'>
                <p>Content</p>
            </Accordion>
        );

        const elExpandButton = screen.getByRole('button');
        userEvent.click(elExpandButton);

        expect(screen.getByTestId('dt_expanded_content')).toHaveClass('h-fit');
    });

    it('should collapse content when clicked', () => {
        render(
            <Accordion icon='' title='Title'>
                <p>Content</p>
            </Accordion>
        );

        const elExpandButton = screen.getByRole('button');
        userEvent.click(elExpandButton);
        userEvent.click(elExpandButton);

        expect(screen.getByTestId('dt_expanded_content')).toHaveClass('max-h-0 overflow-hidden');
    });
});
