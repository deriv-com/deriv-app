import { render, screen } from '@testing-library/react';
import React from 'react';
import ConfirmPhoneNumber from '../ConfirmPhoneNumber';

describe('ConfirmPhoneNumber', () => {
    it('should render ConfirmPhoneNumber component', () => {
        render(<ConfirmPhoneNumber />);
        // screen.debug();
    });
});
