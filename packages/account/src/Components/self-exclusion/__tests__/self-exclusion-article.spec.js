import React from 'react';
import { render, screen } from '@testing-library/react';
import SelfExclusionArticle from '../self-exclusion-article';
import SelfExclusionContext from '../self-exclusion-context';

let mockContext = {};

const nonEU_Item =
    'These self-exclusion limits help you control the amount of money and time you spend trading on DTrader, DBot, and SmartTrader. The limits you set here will help you exercise <0>responsible trading</0>.';
const EU_Item =
    'These trading limits and self-exclusion help you control the amount of money and time you spend on Deriv.com and exercise <0>responsible trading</0>.';

beforeEach(() => {
    mockContext = {
        is_app_settings: false,
        toggleArticle: () => {},
        overlay_ref: {},
        is_eu: false,
        is_uk: false,
        is_deriv_crypto: false,
        is_appstore: false,
    };
});

describe('<SelfExclusionArticle />', () => {
    it('should render SelfExclusionArticle component', () => {
        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionArticle />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.queryByText(EU_Item)).not.toBeInTheDocument();
        expect(screen.queryByText(nonEU_Item)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionArticle component for non EU items', () => {
        mockContext.is_appstore = true;

        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionArticle />
            </SelfExclusionContext.Provider>
        );

        expect(screen.queryByText(nonEU_Item)).not.toBeInTheDocument();
        expect(screen.queryByText(EU_Item)).not.toBeInTheDocument();
    });
});
