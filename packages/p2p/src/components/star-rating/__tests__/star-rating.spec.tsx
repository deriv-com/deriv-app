import React from 'react';
import { render, screen } from '@testing-library/react';
import StarRating from '../star-rating';

describe('<StarRating/>', () => {
    it('renders star rating component without initial value', () => {
        render(
            <div data-testid='dt_star_rating'>
                <StarRating
                    className='star-rating'
                    empty_star_className='star-rating__empty'
                    empty_star_icon='IcEmptyStar'
                    full_star_className='star-rating__full'
                    full_star_icon='IcFullStar'
                    number_of_stars={5}
                    rating_value={0}
                    star_size={15}
                />
            </div>
        );

        expect(screen.getByTestId('dt_star_rating')).toBeInTheDocument();
    });

    it('renders star rating component without icons', () => {
        render(
            <div data-testid='dt_star_rating'>
                <StarRating
                    className='star-rating'
                    empty_star_className='star-rating__empty'
                    empty_star_icon=''
                    full_star_className='star-rating__full'
                    full_star_icon=''
                    initial_value={3}
                    number_of_stars={5}
                    rating_value={0}
                    star_size={15}
                />
            </div>
        );

        expect(screen.getByTestId('dt_star_rating')).toBeInTheDocument();
    });
});
