import React from 'react';
import { screen, render } from '@testing-library/react';
import MyProfilePrivacy from '../my-profile-privacy';

describe('<MyProfilePrivacy />', () => {
    it('should render the MyProfilePrivacy component', () => {
        render(<MyProfilePrivacy />);

        expect(screen.getByText('Show my real name')).toBeInTheDocument();
    });
});
