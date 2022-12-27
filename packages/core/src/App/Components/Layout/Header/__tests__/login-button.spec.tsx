import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoginButton } from '../login-button.jsx';

describe('LoginButton', () => {
    it('should have the right className base on the property', () => {
        render(<LoginButton className='acc-info__button' />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('acc-info__button');
    });
});
