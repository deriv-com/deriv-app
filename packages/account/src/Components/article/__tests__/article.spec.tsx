import React from 'react';
import { screen, render } from '@testing-library/react';
import AccountArticle, { TArticle } from '../article';
import userEvent from '@testing-library/user-event';

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
    });

    it("should invoke the callback on clicking the 'Learn more' link", () => {
        render(<AccountArticle {...props} />);

        userEvent.click(screen.getByText(/Learn more/i));
        expect(props.onClickLearnMore).toHaveBeenCalledTimes(1);
    });
});
