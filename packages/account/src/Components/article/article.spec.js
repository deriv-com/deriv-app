import React from 'react';
import { screen, render } from '@testing-library/react';
import Article from './article';

describe('<Article/>', () => {
    const props = {
        descriptions: [<>description</>],
        title: 'title',
        onClickLearnMore: jest.fn(),
    };

    it('should show proper descriptions', () => {
        const { rerender } = render(<Article {...props} />);

        expect(screen.getByText('description')).toBeInTheDocument();
        expect(screen.getByText('title')).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();

        rerender(<Article {...props} descriptions={[<>desc1</>, <>desc2</>]} />);

        expect(screen.getByText('desc1')).toBeInTheDocument();
        expect(screen.getByText('desc2')).toBeInTheDocument();
    });
});
