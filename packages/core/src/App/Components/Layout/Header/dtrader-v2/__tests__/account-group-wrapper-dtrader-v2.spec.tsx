import React from 'react';
import { render, screen } from '@testing-library/react';
import AccountGroupWrapper from '../account-group-wrapper-dtrader-v2';

const children = 'Children';
const separator_text = 'separator_text';
const mock_props = {
    separator_text,
    show_bottom_separator: false,
};

describe('AccountGroupWrapper', () => {
    it('should render only passed children if separator_text was not passed', () => {
        render(
            <AccountGroupWrapper>
                <div>{children}</div>
            </AccountGroupWrapper>
        );

        expect(screen.getByText(children)).toBeInTheDocument();
        expect(screen.queryByText(separator_text)).not.toBeInTheDocument();
    });

    it('should render passed children and separator_text if it was passed', () => {
        render(
            <AccountGroupWrapper {...mock_props}>
                <div>{children}</div>
            </AccountGroupWrapper>
        );

        expect(screen.getByText(children)).toBeInTheDocument();
        expect(screen.getByText(separator_text)).toBeInTheDocument();
    });
});
