import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FullPageMobileWrapper from '../FullPageMobileWrapper';

const Header = () => <h1>Header</h1>;
const Footer = () => <h1>Footer</h1>;
const Body = () => <h1>Body</h1>;

describe('FullPageMobileWrapper', () => {
    it('should render body, header and/or footer', () => {
        render(
            <FullPageMobileWrapper renderFooter={Footer} renderHeader={Header}>
                <Body />
            </FullPageMobileWrapper>
        );

        expect(screen.getByText('Header')).toBeVisible();
        expect(screen.getByText('Body')).toBeVisible();
        expect(screen.getByText('Footer')).toBeVisible();
    });
    it('should render header only with back functionality', () => {
        const spyOnBack = jest.fn();

        render(
            <FullPageMobileWrapper onBack={spyOnBack} renderHeader={Header}>
                <Body />
            </FullPageMobileWrapper>
        );

        expect(screen.getByText('Header')).toBeVisible();
        expect(screen.getByText('Body')).toBeVisible();
        expect(screen.queryByText('Footer')).not.toBeInTheDocument();

        const backBtn = screen.getByTestId('dt_p2p_v2_mobile_wrapper_button');
        userEvent.click(backBtn);
        expect(spyOnBack).toBeCalled();
    });
    it('should render footer only without back functionality', () => {
        const spyOnBack = jest.fn();

        render(
            <FullPageMobileWrapper onBack={spyOnBack} renderFooter={Footer}>
                <Body />
            </FullPageMobileWrapper>
        );

        expect(screen.queryByText('Header')).not.toBeInTheDocument();
        expect(screen.getByText('Body')).toBeVisible();
        expect(screen.queryByText('Footer')).toBeVisible();
        expect(screen.queryByTestId('dt_p2p_v2_mobile_wrapper_button')).not.toBeInTheDocument();
    });
    it('should hide the left arrow icon', () => {
        render(
            <FullPageMobileWrapper renderHeader={Header} shouldShowBackIcon={false}>
                <Body />
            </FullPageMobileWrapper>
        );

        expect(screen.queryByTestId('dt_p2p_v2_mobile_wrapper_button')).not.toBeInTheDocument();
    });
});
