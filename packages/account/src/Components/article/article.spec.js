import Article from './article.jsx';
import React from 'react';
import { cleanup, render } from '@testing-library/react';
import fc from 'fast-check';

afterEach(cleanup);

describe('<Article />', () => {
    it('rendered list items should be equal to passed down props', () => {
        const screen = render(<Article title='Testing title' descriptions={[]} />);
        expect(screen.container.querySelector('[data-testid=title]').innerHTML).toBe('Testing title');
        expect(screen.getByTestId('description').childElementCount).toBe(0);

        fc.assert(
            fc.property(fc.string(1, 200), fc.array(fc.string(1, 200)), (title, description_list) => {
                screen.rerender(<Article title={title} descriptions={description_list} />);
                expect(screen.getByTestId('title').textContent).toBe(title);
                expect(screen.getByTestId('description').childElementCount).toBe(description_list.length);
                screen.container.querySelector('[data-testid=description]').childNodes.forEach((el, key) => {
                    expect(el.textContent).toBe(description_list[key]);
                });
            })
        );
    });
});
