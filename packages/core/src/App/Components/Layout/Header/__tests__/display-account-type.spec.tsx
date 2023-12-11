import React from 'react';
import { render, screen } from '@testing-library/react';
import DisplayAccountType from '../display-account-type';

describe('DisplayAccountType component', () => {
    it('should render "Multipliers"', () => {
        render(<DisplayAccountType account_type='financial' country_standpoint={{}} is_eu={false} />);
        expect(screen.getByText(/multipliers/i)).toBeInTheDocument();
    });

    it('should render "Gaming" if is_united_kingdom = true', () => {
        render(
            <DisplayAccountType account_type='gaming' country_standpoint={{ is_united_kingdom: true }} is_eu={false} />
        );
        expect(screen.getByText(/gaming/i)).toBeInTheDocument();
    });

    it('should render "Options" for Belgium', () => {
        render(<DisplayAccountType account_type='gaming' country_standpoint={{ is_belgium: true }} is_eu={true} />);
        expect(screen.getByText(/options/i)).toBeInTheDocument();
    });

    it('should render "Options" when is_isle_of_man = false', () => {
        render(
            <DisplayAccountType account_type='gaming' country_standpoint={{ is_isle_of_man: false }} is_eu={true} />
        );
        expect(screen.getByText(/options/i)).toBeInTheDocument();
    });

    it('should render "Derived" when is_isle_of_man = false', () => {
        render(
            <DisplayAccountType account_type='gaming' country_standpoint={{ is_isle_of_man: false }} is_eu={true} />
        );
        expect(screen.getByText(/options/i)).toBeInTheDocument();
    });
});
