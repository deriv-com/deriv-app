import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Popup } from '@deriv/components';
import SelfExclusionArticleContent from '../self-exclusion-article-content';
import SelfExclusionContext from '../self-exclusion-context';

Popup.Overlay = jest.fn(() => <div>Trading limits</div>);

describe('<SelfExclusionArticleContent />', () => {
    let mock_context = {};
    const descr_text = 'About trading limits and self-exclusion';
    const eu_item =
        'When you set your limits or self-exclusion, they will be aggregated across all your account types in Deriv Trader and Deriv Bot. For example, the losses made on both platforms will add up and be counted towards the loss limit you set.';
    const eu_uk_item =
        'These trading limits are optional, and you can strengthen them at any time. If you don’t wish to set a specific limit, leave the field blank. If you live in the United Kingdom, Customer Support can only remove or weaken your trading limits after 24 hours of receiving the request. If you live in the Isle of Man, Customer Support can only remove or weaken your trading limits after your trading limit period has expired.';
    const not_app_settings_eu_descr =
        /You can also exclude yourself entirely for a specified duration. If, at any time, you decide to trade again, you must then contact our Customer Support to remove this self-exclusion. There will be a 24-hour-cooling-off period before you can resume trading/i;
    const not_app_settings_eu_uk_descr =
        /You can also exclude yourself entirely for a specified duration. This can only be removed once your self-exclusion has expired. If you wish to continue trading once your self-exclusion period expires, you must contact Customer Support by calling/i;
    const not_app_settings_non_eu_descr =
        /You can also exclude yourself entirely for a specified duration. Once the self-exclusion period has ended, you can either extend it further or resume trading immediately. If you wish to reduce or remove the self-exclusion period, contact our/i;
    const non_eu_item =
        'These limits are optional, and you can adjust them at any time. You decide how much and how long you’d like to trade. If you don’t wish to set a specific limit, leave the field blank.';

    beforeEach(() => {
        mock_context = {
            is_app_settings: false,
            is_eu: false,
            is_uk: false,
            overlay_ref: {},
            toggleArticle: jest.fn(),
        };
    });

    it('should render SelfExclusionArticleContent component with popup', () => {
        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionArticleContent is_in_overlay />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('Trading limits')).toBeInTheDocument();
    });

    it('should render SelfExclusionArticleContent component without button non EU', () => {
        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionArticleContent />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText(descr_text)).toBeInTheDocument();
        expect(screen.getByText(not_app_settings_non_eu_descr)).toBeInTheDocument();
        expect(screen.getByText(non_eu_item)).toBeInTheDocument();
        expect(screen.queryByText('Done')).not.toBeInTheDocument();
        expect(screen.queryByText(eu_item)).not.toBeInTheDocument();
        expect(screen.queryByText(eu_uk_item)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionArticleContent with items component with button and trigger click EU', () => {
        mock_context.is_app_settings = true;
        const mockToggleArticle = mock_context.toggleArticle;

        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionArticleContent />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText(descr_text)).toBeInTheDocument();
        expect(screen.getByText('Done')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button'));
        expect(mockToggleArticle).toHaveBeenCalledTimes(1);
    });

    it('should render selfExclusionArticleItems component for EU items', () => {
        mock_context.is_eu = true;

        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionArticleContent />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText(descr_text)).toBeInTheDocument();
        expect(screen.getByText(eu_item)).toBeInTheDocument();
        expect(screen.getByText(not_app_settings_eu_descr)).toBeInTheDocument();
        expect(screen.queryByText(eu_uk_item)).not.toBeInTheDocument();
        expect(screen.queryByText(non_eu_item)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionArticleContent component for EU/UK items', () => {
        mock_context.is_eu = true;
        mock_context.is_uk = true;

        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionArticleContent />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText(eu_item)).toBeInTheDocument();
        expect(screen.getByText(eu_uk_item)).toBeInTheDocument();
        expect(screen.getByText(not_app_settings_eu_uk_descr)).toBeInTheDocument();
        expect(screen.queryByText(non_eu_item)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionArticleContent component for EU/UK items with app settings', () => {
        mock_context.is_app_settings = true;
        mock_context.is_eu = true;
        mock_context.is_uk = true;

        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionArticleContent />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText(eu_item)).toBeInTheDocument();
        expect(screen.getByText(eu_uk_item)).toBeInTheDocument();
        expect(screen.queryByText(not_app_settings_eu_descr)).not.toBeInTheDocument();
        expect(screen.queryByText(not_app_settings_eu_uk_descr)).not.toBeInTheDocument();
        expect(screen.queryByText(non_eu_item)).not.toBeInTheDocument();
    });
});
