import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Popup } from '@deriv/components';
import SelfExclusionArticleContent from '../self-exclusion-article-content';
import SelfExclusionContext from '../self-exclusion-context';
import { createPortal } from 'react-dom';

Popup.Overlay = jest.fn(() => createPortal(<div>Trading limits</div>, document.body));

describe('<SelfExclusionArticleContent />', () => {
    let mock_context = {
        is_app_settings: false,
        is_eu: false,
        currency: '',
        overlay_ref: document.createElement('div'),
        toggleArticle: jest.fn(),
        handleSubmit: jest.fn(),
    };
    const descr_text = 'About trading limits and self-exclusion';
    const eu_item = /These limits apply to your multipliers trades only. For example,/;
    const not_app_settings_eu_descr = /We’ll make the adjustments within 24 hours./i;
    const not_app_settings_non_eu_descr = /If you want to adjust your self-exclusion limits,/i;
    const non_eu_item =
        'You decide how much and how long to trade. You can take a break from trading whenever you want. This break can be from 6 weeks to 5 years. When it’s over, you can extend it or log in to resume trading. If you don’t want to set a specific limit, leave the field empty.';

    beforeEach(() => {
        mock_context = {
            is_app_settings: false,
            is_eu: false,
            currency: '',
            overlay_ref: document.createElement('div'),
            toggleArticle: jest.fn(),
            handleSubmit: jest.fn(),
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
        expect(screen.queryByText(non_eu_item)).not.toBeInTheDocument();
    });
});
