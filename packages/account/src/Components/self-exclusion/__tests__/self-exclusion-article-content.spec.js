import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelfExclusionArticleContent from '../self-exclusion-article-content';
import SelfExclusionContext from '../self-exclusion-context';
import { Popup } from '@deriv/components';

Popup.Overlay = jest.fn(() => <div>Trading limits</div>);
let mockContext = {};

describe('<SelfExclusionArticleContent />', () => {
    const descrText = 'About trading limits and self-exclusion';
    const nonEU_Item =
        'These limits are optional, and you can adjust them at any time. You decide how much and how long you’d like to trade. If you don’t wish to set a specific limit, leave the field blank.';
    const EU_Item =
        'When you set your limits or self-exclusion, they will be aggregated across all your account types in DTrader and DBot. For example, the losses made on both platforms will add up and be counted towards the loss limit you set.';
    const EU_UK_Item =
        'These trading limits are optional, and you can strengthen them at any time. If you don’t wish to set a specific limit, leave the field blank. If you live in the United Kingdom, Customer Support can only remove or weaken your trading limits after 24 hours of receiving the request. If you live in the Isle of Man, Customer Support can only remove or weaken your trading limits after your trading limit period has expired.';

    const not_app_settings_nonEU_descr =
        /You can also exclude yourself entirely for a specified duration. Once the self-exclusion period has ended, you can either extend it further or resume trading immediately. If you wish to reduce or remove the self-exclusion period, contact our/i;
    const not_app_settings_EU_descr =
        /You can also exclude yourself entirely for a specified duration. If, at any time, you decide to trade again, you must then contact our Customer Support to remove this self-exclusion. There will be a 24-hour-cooling-off period before you can resume trading/i;
    const not_app_settings_EU_UK_descr =
        /You can also exclude yourself entirely for a specified duration. This can only be removed once your self-exclusion has expired. If you wish to continue trading once your self-exclusion period expires, you must contact Customer Support by calling/i;

    beforeEach(() => {
        mockContext = {
            is_app_settings: false,
            toggleArticle: jest.fn(),
            overlay_ref: {},
            is_eu: false,
            is_uk: false,
        };
    });
    it('should render SelfExclusionArticleContent component with popup', () => {
        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionArticleContent is_in_overlay />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('Trading limits')).toBeInTheDocument();
    });

    it('should render SelfExclusionArticleContent component without button not EU', () => {
        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionArticleContent />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText(descrText)).toBeInTheDocument();
        expect(screen.queryByText('Done')).not.toBeInTheDocument();
        expect(screen.getByText(nonEU_Item)).toBeInTheDocument();
        expect(screen.queryByText(EU_Item)).not.toBeInTheDocument();
        expect(screen.queryByText(EU_UK_Item)).not.toBeInTheDocument();
        expect(screen.getByText(not_app_settings_nonEU_descr)).toBeInTheDocument();
    });

    it('should render SelfExclusionArticleContent with items component with button and trigger click EU', () => {
        mockContext.is_app_settings = true;
        const onClick = mockContext.toggleArticle;

        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionArticleContent />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText(descrText)).toBeInTheDocument();
        expect(screen.getByText('Done')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render selfExclusionArticleItems component for EU items', () => {
        mockContext.is_eu = true;

        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionArticleContent />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText(descrText)).toBeInTheDocument();
        expect(screen.getByText(EU_Item)).toBeInTheDocument();
        expect(screen.getByText(not_app_settings_EU_descr)).toBeInTheDocument();
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
        expect(screen.getByText(not_app_settings_EU_UK_descr)).toBeInTheDocument();
        expect(screen.queryByText(nonEU_Item)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionArticleContent component for EU/UK items with app settings', () => {
        mockContext.is_eu = true;
        mockContext.is_uk = true;
        mockContext.is_app_settings = true;

        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionArticleContent />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText(EU_UK_Item)).toBeInTheDocument();
        expect(screen.getByText(EU_Item)).toBeInTheDocument();
        expect(screen.queryByText(nonEU_Item)).not.toBeInTheDocument();
        expect(screen.queryByText(not_app_settings_EU_descr)).not.toBeInTheDocument();
        expect(screen.queryByText(not_app_settings_EU_UK_descr)).not.toBeInTheDocument();
    });
});
