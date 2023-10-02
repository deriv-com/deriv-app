import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecommendUser from '../recommend-user';

describe('<RecommendUser />', () => {
    const recommend_user_props = {
        is_buy_order_for_user: false,
        is_user_recommended_previously: null,
        onClickClearRecommendation: jest.fn(),
        onClickNotRecommended: jest.fn(),
        onClickRecommended: jest.fn(),
    };

    it('should render the component with correct message if it is not a buy order for the user and both buttons', () => {
        render(<RecommendUser {...recommend_user_props} />);

        expect(screen.getByText('Would you recommend this buyer?')).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('should render the component with correct message if it is a buy order for the user and both buttons', () => {
        render(<RecommendUser {...recommend_user_props} is_buy_order_for_user />);

        expect(screen.getByText('Would you recommend this seller?')).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('should auto select the Yes button if the user was previously recommended', () => {
        render(<RecommendUser {...recommend_user_props} is_user_recommended_previously={1} />);

        const yesButton = screen.getByRole('button', { name: 'Yes' });
        const noButton = screen.getByRole('button', { name: 'No' });

        const yesText = within(yesButton).getByText('Yes');
        const noText = within(noButton).getByText('No');

        expect(yesText).toHaveStyle('color: var(--text-prominent)');
        expect(noText).toHaveStyle('color: var(--text-less-prominent)');
    });

    it('should disable the Yes Button after being clicked', () => {
        render(<RecommendUser {...recommend_user_props} is_user_recommended_previously={1} />);

        const yesButton = screen.getByRole('button', { name: 'Yes' });
        const yesText = within(yesButton).getByText('Yes');

        userEvent.click(yesButton);

        expect(yesText).toHaveStyle('color: var(--text-less-prominent)');
        expect(recommend_user_props.onClickClearRecommendation).toHaveBeenCalledTimes(1);
        expect(recommend_user_props.onClickRecommended).toHaveBeenCalledTimes(1);
    });

    it('should disable the No Button after being clicked', () => {
        render(<RecommendUser {...recommend_user_props} is_user_recommended_previously={0} />);

        const noButton = screen.getByRole('button', { name: 'No' });
        const noText = within(noButton).getByText('No');

        expect(noText).toHaveStyle('color: var(--text-prominent)');

        userEvent.click(noButton);

        expect(noText).toHaveStyle('color: var(--text-less-prominent)');
        expect(recommend_user_props.onClickClearRecommendation).toHaveBeenCalledTimes(1);
        expect(recommend_user_props.onClickNotRecommended).toHaveBeenCalledTimes(1);
    });

    it('should disable the other button if one of the buttons are selected', () => {
        render(<RecommendUser {...recommend_user_props} is_user_recommended_previously={0} />);

        const yesButton = screen.getByRole('button', { name: 'Yes' });
        const noButton = screen.getByRole('button', { name: 'No' });

        userEvent.click(yesButton);

        const yesText = within(yesButton).getByText('Yes');
        const noText = within(noButton).getByText('No');

        expect(yesText).toHaveStyle('color: var(--text-prominent)');
        expect(noText).toHaveStyle('color: var(--text-less-prominent)');
        expect(recommend_user_props.onClickRecommended).toHaveBeenCalledTimes(1);

        userEvent.click(noButton);

        expect(noText).toHaveStyle('color: var(--text-prominent)');
        expect(yesText).toHaveStyle('color: var(--text-less-prominent)');
        expect(recommend_user_props.onClickNotRecommended).toHaveBeenCalledTimes(2);
    });
});
