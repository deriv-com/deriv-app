import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelfExclusionArticle from '../self-exclusion-article';
import SelfExclusionContext from '../self-exclusion-context';
import { selfExclusionArticleItems } from 'Components/self-exclusion/self-exclusion-article-content.jsx';
import { isMobile, isDesktop, PlatformContext } from '@deriv/shared';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
    isDesktop: jest.fn(),
}));

jest.mock('Components/self-exclusion/self-exclusion-article-content.jsx', () => ({
    ...jest.requireActual('Components/self-exclusion/self-exclusion-article-content.jsx'),
    selfExclusionArticleItems: jest.fn(),
}));

describe('<SelfExclusionArticle />', () => {
    const nonEU_Item =
        /These self-exclusion limits help you control the amount of money and time you spend trading on DTrader, DBot, and SmartTrader. The limits you set here will help you exercise/i;
    const EU_Item =
        /These trading limits and self-exclusion help you control the amount of money and time you spend on Deriv.com and exercise/i;

    let mockSelfContext = {};
    let mockPaltformContext = {};

    beforeEach(() => {
        mockSelfContext = {
            is_app_settings: false,
            toggleArticle: jest.fn(),
            overlay_ref: {},
            is_eu: false,
            is_uk: false,
        };
        mockPaltformContext = {
            is_deriv_crypto: false,
            is_appstore: false,
        };
    });

    it('should render SelfExclusionArticle desktop component with selfExclusionArticleItems', () => {
        mockPaltformContext.is_appstore = true;
        isDesktop.mockReturnValueOnce(true);
        isMobile.mockReturnValueOnce(false);
        selfExclusionArticleItems.mockImplementation(() => ['selfExclusionArticleItems']);

        render(
            <PlatformContext.Provider value={mockPaltformContext}>
                <SelfExclusionContext.Provider value={mockSelfContext}>
                    <SelfExclusionArticle />
                </SelfExclusionContext.Provider>
            </PlatformContext.Provider>
        );

        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.getByText('selfExclusionArticleItems')).toBeInTheDocument();
        expect(screen.queryByText(EU_Item)).not.toBeInTheDocument();
        expect(screen.queryByText(nonEU_Item)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionArticle desktop component without is_appstore for EU items', () => {
        mockSelfContext.is_eu = true;

        render(
            <PlatformContext.Provider value={mockPaltformContext}>
                <SelfExclusionContext.Provider value={mockSelfContext}>
                    <SelfExclusionArticle />
                </SelfExclusionContext.Provider>
            </PlatformContext.Provider>
        );

        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.getByText(EU_Item)).toBeInTheDocument();
        expect(screen.queryByText(nonEU_Item)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionArticle desktop component for non EU items', () => {
        mockPaltformContext.is_appstore = true;
        isDesktop.mockReturnValueOnce(false);
        isMobile.mockReturnValueOnce(false);

        render(
            <PlatformContext.Provider value={mockPaltformContext}>
                <SelfExclusionContext.Provider value={mockSelfContext}>
                    <SelfExclusionArticle />
                </SelfExclusionContext.Provider>
            </PlatformContext.Provider>
        );

        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.queryByText(EU_Item)).not.toBeInTheDocument();
        expect(screen.getByText(nonEU_Item)).toBeInTheDocument();
    });

    it('should render SelfExclusionArticle mobile component and trigger click', () => {
        isDesktop.mockReturnValueOnce(false);
        isMobile.mockReturnValueOnce(true);
        const onClickLearnMore = mockSelfContext.toggleArticle;

        render(
            <PlatformContext.Provider value={mockPaltformContext}>
                <SelfExclusionContext.Provider value={mockSelfContext}>
                    <SelfExclusionArticle />
                </SelfExclusionContext.Provider>
            </PlatformContext.Provider>
        );

        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.queryByText(EU_Item)).not.toBeInTheDocument();
        expect(screen.getByText(nonEU_Item)).toBeInTheDocument();
        fireEvent.click(screen.getByText('Learn more'));
        expect(onClickLearnMore).toHaveBeenCalledTimes(1);
    });
});
