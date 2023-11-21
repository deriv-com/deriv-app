import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Accordion from '../accordion';

const mocked_props = {
    content_data: [
        'test dasdasdasde 1',
        {
            content: 'content 1',
            header: 'header 1',
        },
        {
            content: 'content 2',
            header: 'header 2',
        },

        {
            content: 'content 3',
            header: 'header 3',
        },
    ],
    expanded: true,
    test_id: 'test_string',
};

describe('<Accordion />', () => {
    it('should render Accordion with correct props and content', () => {
        render(<Accordion {...mocked_props} />);
        const accordion = screen.getByTestId('test_string');
        expect(accordion).toBeInTheDocument();
    });

    it('should not render Accordion if content_data is empty', () => {
        const props_with_empty_content = {
            ...mocked_props,
            content_data: null,
        };
        render(<Accordion {...props_with_empty_content} />);
        const accordion = screen.queryByTestId('test_string');
        expect(accordion).not.toBeInTheDocument();
    });

    it('should open accordion', async () => {
        render(<Accordion {...mocked_props} />);
        await waitFor(() => {
            expect(screen.getByTestId('accordion-content')).toHaveClass('dbot-accordion__content--open');
        });
    });
    it('should close accordion', async () => {
        render(<Accordion {...mocked_props} />);
        const accordion = screen.getByTestId('test_string');
        fireEvent.click(accordion);
        await waitFor(() => {
            expect(screen.getByTestId('accordion-content')).not.toHaveClass('dbot-accordion__content--open');
        });
    });
});
