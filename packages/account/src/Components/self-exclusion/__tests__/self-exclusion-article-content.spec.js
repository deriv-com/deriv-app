import React from 'react';
import { render, screen } from '@testing-library/react';
import SelfExclusionArticleContent from '../self-exclusion-article-content';
import SelfExclusionContext from '../self-exclusion-context';
import { Popup } from '@deriv/components';

Popup.Overlay = jest.fn(() => <div>Trading limits</div>);
let mockContext = {};

const nonEU_Item =
    'These limits are optional, and you can adjust them at any time. You decide how much and how long you’d like to trade. If you don’t wish to set a specific limit, leave the field blank.';
const EU_Item =
    'When you set your limits or self-exclusion, they will be aggregated across all your account types in DTrader and DBot. For example, the losses made on both platforms will add up and be counted towards the loss limit you set.';
const EU_UK_Item =
    'These trading limits are optional, and you can strengthen them at any time. If you don’t wish to set a specific limit, leave the field blank. If you live in the United Kingdom, Customer Support can only remove or weaken your trading limits after 24 hours of receiving the request. If you live in the Isle of Man, Customer Support can only remove or weaken your trading limits after your trading limit period has expired.';

beforeEach(() => {
    mockContext = {
        is_app_settings: false,
        toggleArticle: () => {},
        overlay_ref: {},
        is_eu: false,
        is_uk: false,
    };
});

describe('<SelfExclusionArticleContent />', () => {
    it('should render SelfExclusionArticleContent component', () => {
        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionArticleContent />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('About trading limits and self-exclusion')).toBeInTheDocument();
    });

    it('should render SelfExclusionArticleContent component with popup', () => {
        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionArticleContent is_in_overlay />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('Trading limits')).toBeInTheDocument();
    });

    it('should render SelfExclusionArticleContent component for non EU items', () => {
        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionArticleContent />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText(nonEU_Item)).toBeInTheDocument();
        expect(screen.queryByText(EU_Item)).not.toBeInTheDocument();
        expect(screen.queryByText(EU_UK_Item)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionArticleContent component for EU items', () => {
        mockContext.is_eu = true;

        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionArticleContent />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText(EU_Item)).toBeInTheDocument();
        expect(screen.queryByText(nonEU_Item)).not.toBeInTheDocument();
        expect(screen.queryByText(EU_UK_Item)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionArticleContent component for EU/UK items', () => {
        mockContext.is_eu = true;
        mockContext.is_uk = true;

        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionArticleContent />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText(EU_UK_Item)).toBeInTheDocument();
        expect(screen.getByText(EU_Item)).toBeInTheDocument();
        expect(screen.queryByText(nonEU_Item)).not.toBeInTheDocument();
    });
});
