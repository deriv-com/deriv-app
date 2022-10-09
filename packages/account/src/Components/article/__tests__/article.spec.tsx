import React from 'react';
import { screen, render } from '@testing-library/react';
import AccountArticle, { TArticle } from '../article';

describe('<AccountArticle/>', () => {
    const props: TArticle = {
        descriptions: [<>Description</>],
        title: 'Title',
        onClickLearnMore: jest.fn(),
    };

    it('should render AccountArticle and show proper descriptions', () => {
        const { rerender } = render(<AccountArticle {...props} />);

        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();

        props.descriptions = [<>Description 1</>, <>Description 2</>];

        rerender(<AccountArticle {...props} />);

        expect(screen.getByText('Description 1')).toBeInTheDocument();
        expect(screen.getByText('Description 2')).toBeInTheDocument();

        props.descriptions = [
            {
                key: 'key 1',
                component: <>Description 3</>,
            },
            {
                key: 'key 2',
                component: <>Description 4</>,
            },
        ];
        rerender(<AccountArticle {...props} />);

        expect(screen.getByText('Description 3')).toBeInTheDocument();
        expect(screen.getByText('Description 4')).toBeInTheDocument();
    });
});
