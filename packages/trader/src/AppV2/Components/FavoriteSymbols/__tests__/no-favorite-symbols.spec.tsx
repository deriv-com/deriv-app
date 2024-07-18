import React from 'react';
import { screen, render } from '@testing-library/react';
import NoFavoriteSymbols from '../no-favorite-symbols';

describe('<NoFavoriteSymbol />', () => {
    it('should show correct text', () => {
        render(<NoFavoriteSymbols />);
        expect(screen.getByText('No favourites')).toBeInTheDocument();
        expect(screen.getByText('Your favourite markets will appear here.')).toBeInTheDocument();
    });
});
