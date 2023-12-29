import React from 'react';
import { screen, render } from '@testing-library/react';
import ApiTokenArticle from '../api-token-article';

it('should render ApiTokenArticle', () => {
    render(<ApiTokenArticle />);
    expect(screen.getByText('API token')).toBeInTheDocument();
    expect(
        screen.getByText(
            "To access your mobile apps and other third-party apps, you'll first need to generate an API token."
        )
    ).toBeInTheDocument();
});
