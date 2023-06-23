import React from 'react';
import { render, screen } from '@testing-library/react';
import AdFormWrapper from '../ad-form-wrapper';

describe('<AdFormWrapper/>', () => {
    it('renders component with passed title and children', () => {
        render(
            <AdFormWrapper>
                <div>Testing Form Wrapper</div>
            </AdFormWrapper>
        );

        expect(screen.getByText('Testing Form Wrapper')).toBeInTheDocument();
    });
});
