import React from 'react';
import { render, screen } from '@testing-library/react';
import MyProfileSeparatorContainer from '../my-profile-separator-container.jsx';

describe('<MyProfileSeparatorContainer/>', () => {
    it('should render the component', () => {
        render(
            <MyProfileSeparatorContainer>
                <div>Child comp</div>
            </MyProfileSeparatorContainer>
        );
        expect(screen.getByText('Child comp')).toBeInTheDocument();
    });
});
