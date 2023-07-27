import React from 'react';
import { screen, render } from '@testing-library/react';
import ShareMyAdsSocials from '../share-my-ads-socials';

describe('<ShareMyAdsSocials />', () => {
    it('should render all the social media platforms', () => {
        render(<ShareMyAdsSocials />);

        expect(screen.getByText('WhatsApp')).toBeInTheDocument();
        expect(screen.getByText('Facebook')).toBeInTheDocument();
        expect(screen.getByText('Telegram')).toBeInTheDocument();
        expect(screen.getByText('Twitter')).toBeInTheDocument();
        expect(screen.getByText('Gmail')).toBeInTheDocument();
    });
});
