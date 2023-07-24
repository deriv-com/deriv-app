import React from 'react';
import { isMobile, isDesktop, PlatformContext } from '@deriv/shared';
import { fireEvent, render, screen } from '@testing-library/react';
import SelfExclusionArticle from '../self-exclusion-article';
import { selfExclusionArticleItems } from 'Components/self-exclusion/self-exclusion-article-content';
import SelfExclusionContext from '../self-exclusion-context';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(),
    isMobile: jest.fn(),
}));

jest.mock('Components/self-exclusion/self-exclusion-article-content', () => ({
    ...jest.requireActual('Components/self-exclusion/self-exclusion-article-content'),
    selfExclusionArticleItems: jest.fn(),
}));

describe('<SelfExclusionArticle />', () => {
    let mock_platform_context = {
        is_appstore: false,
        is_deriv_crypto: false,
    };
    let mock_self_exclusion_context = {
        is_app_settings: false,
        is_eu: false,
        is_uk: false,
        currency: '',
        overlay_ref: document.createElement('div'),
        toggleArticle: jest.fn(),
        handleSubmit: jest.fn(),
    };

    const eu_item =
        /these trading limits and self-exclusion help you control the amount of money and time you spend on deriv.com and exercise/i;
    const non_eu_item =
        /these self-exclusion limits help you control the amount of money and time you spend trading on deriv trader, deriv bot, smarttrader and binary bot on deriv. the limits you set here will help you exercise/i;

    beforeEach(() => {
        mock_platform_context = {
            is_appstore: false,
            is_deriv_crypto: false,
        };
        mock_self_exclusion_context = {
            is_app_settings: false,
            is_eu: false,
            is_uk: false,
            currency: '',
            overlay_ref: document.createElement('div'),
            toggleArticle: jest.fn(),
            handleSubmit: jest.fn(),
        };
    });

    it('should render SelfExclusionArticle desktop component with selfExclusionArticleItems', () => {
        (isDesktop as jest.Mock).mockReturnValueOnce(true);
        (isMobile as jest.Mock).mockReturnValueOnce(false);
        mock_platform_context.is_appstore = true;

        (selfExclusionArticleItems as jest.Mock).mockImplementation(() => ['Self Exclusion Article Items']);

        render(
            <PlatformContext.Provider value={mock_platform_context}>
                <SelfExclusionContext.Provider value={mock_self_exclusion_context}>
                    <SelfExclusionArticle />
                </SelfExclusionContext.Provider>
            </PlatformContext.Provider>
        );

        expect(screen.getByText('Self Exclusion Article Items')).toBeInTheDocument();
        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.queryByText(eu_item)).not.toBeInTheDocument();
        expect(screen.queryByText(non_eu_item)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionArticle desktop component without is_appstore for EU items', () => {
        mock_self_exclusion_context.is_eu = true;

        render(
            <PlatformContext.Provider value={mock_platform_context}>
                <SelfExclusionContext.Provider value={mock_self_exclusion_context}>
                    <SelfExclusionArticle />
                </SelfExclusionContext.Provider>
            </PlatformContext.Provider>
        );

        expect(screen.getByText(eu_item)).toBeInTheDocument();
        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.queryByText(non_eu_item)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionArticle desktop component for non EU items', () => {
        mock_platform_context.is_appstore = true;
        (isDesktop as jest.Mock).mockReturnValueOnce(false);
        (isMobile as jest.Mock).mockReturnValueOnce(false);

        render(
            <PlatformContext.Provider value={mock_platform_context}>
                <SelfExclusionContext.Provider value={mock_self_exclusion_context}>
                    <SelfExclusionArticle />
                </SelfExclusionContext.Provider>
            </PlatformContext.Provider>
        );

        expect(screen.getByText(non_eu_item)).toBeInTheDocument();
        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.queryByText(eu_item)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionArticle mobile component and trigger click', () => {
        (isDesktop as jest.Mock).mockReturnValueOnce(false);
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        const mockToggleArticle = mock_self_exclusion_context.toggleArticle;

        render(
            <PlatformContext.Provider value={mock_platform_context}>
                <SelfExclusionContext.Provider value={mock_self_exclusion_context}>
                    <SelfExclusionArticle />
                </SelfExclusionContext.Provider>
            </PlatformContext.Provider>
        );

        expect(screen.getByText(non_eu_item)).toBeInTheDocument();
        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.queryByText(eu_item)).not.toBeInTheDocument();
        fireEvent.click(screen.getByText('Learn more'));
        expect(mockToggleArticle).toHaveBeenCalledTimes(1);
    });
});
