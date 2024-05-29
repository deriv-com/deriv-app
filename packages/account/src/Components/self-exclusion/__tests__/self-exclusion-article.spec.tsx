import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SelfExclusionArticle from '../self-exclusion-article';
import { selfExclusionArticleItems } from 'Components/self-exclusion/self-exclusion-article-content';
import SelfExclusionContext from '../self-exclusion-context';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('Components/self-exclusion/self-exclusion-article-content', () => ({
    ...jest.requireActual('Components/self-exclusion/self-exclusion-article-content'),
    selfExclusionArticleItems: jest.fn(),
}));

describe('<SelfExclusionArticle />', () => {
    let mock_self_exclusion_context = {
        is_app_settings: false,
        is_eu: false,
        currency: '',
        overlay_ref: document.createElement('div'),
        toggleArticle: jest.fn(),
        handleSubmit: jest.fn(),
    };

    const store = mockStore({});

    const eu_item =
        /these trading limits and self-exclusion help you control the amount of money and time you spend on deriv.com and exercise/i;
    const non_eu_item =
        /these self-exclusion limits help you control the amount of money and time you spend trading on deriv trader, deriv bot, smarttrader and binary bot on deriv. the limits you set here will help you exercise/i;

    beforeEach(() => {
        mock_self_exclusion_context = {
            is_app_settings: false,
            is_eu: false,
            currency: '',
            overlay_ref: document.createElement('div'),
            toggleArticle: jest.fn(),
            handleSubmit: jest.fn(),
        };
    });

    it('should render SelfExclusionArticle desktop component with selfExclusionArticleItems', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: true });
        (selfExclusionArticleItems as jest.Mock).mockImplementation(() => ['Self Exclusion Article Items']);

        render(
            <StoreProvider store={store}>
                <SelfExclusionContext.Provider value={mock_self_exclusion_context}>
                    <SelfExclusionArticle />
                </SelfExclusionContext.Provider>
            </StoreProvider>
        );

        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.queryByText(eu_item)).not.toBeInTheDocument();
        expect(screen.queryByText(non_eu_item)).toBeInTheDocument();
    });

    it('should render SelfExclusionArticle desktop component without is_appstore for EU items', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: true });
        mock_self_exclusion_context.is_eu = true;

        render(
            <StoreProvider store={store}>
                <SelfExclusionContext.Provider value={mock_self_exclusion_context}>
                    <SelfExclusionArticle />
                </SelfExclusionContext.Provider>
            </StoreProvider>
        );

        expect(screen.getByText(eu_item)).toBeInTheDocument();
        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.queryByText(non_eu_item)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionArticle desktop component for non EU items', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: true });

        render(
            <StoreProvider store={store}>
                <SelfExclusionContext.Provider value={mock_self_exclusion_context}>
                    <SelfExclusionArticle />
                </SelfExclusionContext.Provider>
            </StoreProvider>
        );

        expect(screen.getByText(non_eu_item)).toBeInTheDocument();
        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.queryByText(eu_item)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionArticle mobile component and trigger click', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });
        const mockToggleArticle = mock_self_exclusion_context.toggleArticle;

        render(
            <StoreProvider store={store}>
                <SelfExclusionContext.Provider value={mock_self_exclusion_context}>
                    <SelfExclusionArticle />
                </SelfExclusionContext.Provider>
            </StoreProvider>
        );

        expect(screen.getByText(non_eu_item)).toBeInTheDocument();
        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.queryByText(eu_item)).not.toBeInTheDocument();
        fireEvent.click(screen.getByText('Learn more'));
        expect(mockToggleArticle).toHaveBeenCalledTimes(1);
    });
});
