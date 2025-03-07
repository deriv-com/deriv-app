import React from 'react';
import { render, act, waitFor, screen } from '@testing-library/react';
import { useLocalStorageData } from '@deriv/hooks';
import { getLocalStorage } from '@deriv/utils';
import TradeParamsGuide from '../trade-params-guide';
import { TGuideContainerProps } from '../../GuideForPages/guide-container';

let lastPassedProps: TGuideContainerProps;

jest.mock('@deriv/hooks', () => ({
    useLocalStorageData: jest.fn(),
}));

jest.mock('@deriv/utils', () => ({
    getLocalStorage: jest.fn(),
}));

const MockLocalize = ({ i18n_default_text }: { i18n_default_text: string }) => i18n_default_text;

jest.mock('@deriv/translations', () => ({
    Localize: (props: { i18n_default_text: string }) => MockLocalize(props),
}));

jest.mock('../../GuideForPages/guide-container', () => ({
    __esModule: true,
    default: (props: TGuideContainerProps) => {
        lastPassedProps = props;
        return (
            <div data-testid='mock-guide-container' data-should-run={props.should_run}>
                <button onClick={props.callback} data-testid='callback-button'>
                    Close Guide
                </button>
            </div>
        );
    },
}));

describe('TradeParamsGuide', () => {
    let mockSetGuideDtraderV2: jest.Mock;

    beforeEach(() => {
        jest.useFakeTimers();
        lastPassedProps = {
            should_run: false,
            steps: [
                {
                    content: 'test',
                    target: '',
                },
            ],
            callback: jest.fn(),
        };
        mockSetGuideDtraderV2 = jest.fn();
        (useLocalStorageData as jest.Mock).mockReturnValue([
            {
                trade_types_selection: false,
                trade_page: false,
                positions_page: false,
                market_selector: false,
                trade_param_quick_adjustment: false,
                trade_params: false,
            },
            mockSetGuideDtraderV2,
        ]);
        (getLocalStorage as jest.Mock).mockReturnValue({
            trade_types_selection: false,
            trade_page: false,
            positions_page: false,
            market_selector: false,
            trade_param_quick_adjustment: false,
            trade_params: false,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    it('should render GuideContainer with correct initial props', () => {
        render(<TradeParamsGuide />);
        expect(lastPassedProps.should_run).toBe(false);
    });
    it('should show guide when trade parameter tooltip appears', async () => {
        const tradeElement = document.createElement('div');
        tradeElement.className = 'trade';
        document.body.appendChild(tradeElement);

        jest.spyOn(document, 'querySelector').mockReturnValue(tradeElement);

        render(<TradeParamsGuide />);

        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'trade__parameter-tooltip-info';
        tradeElement.appendChild(tooltipElement);

        act(() => {
            jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
            expect(lastPassedProps.should_run).toBe(true);
        });

        expect(mockSetGuideDtraderV2).toHaveBeenCalledWith({
            trade_types_selection: false,
            trade_page: false,
            positions_page: false,
            market_selector: false,
            trade_param_quick_adjustment: false,
            trade_params: true,
        });

        document.body.removeChild(tradeElement);
    });

    it('should not show guide when trade_params is already true', () => {
        (useLocalStorageData as jest.Mock).mockReturnValue([
            {
                trade_types_selection: false,
                trade_page: false,
                positions_page: false,
                market_selector: false,
                trade_param_quick_adjustment: false,
                trade_params: true,
            },
            mockSetGuideDtraderV2,
        ]);

        render(<TradeParamsGuide />);
        expect(lastPassedProps.should_run).toBe(false);
    });
    it('should handle callback to hide guide', async () => {
        render(<TradeParamsGuide />);

        act(() => {
            lastPassedProps.callback?.();
        });

        expect(lastPassedProps.should_run).toBe(false);
    });
    it('should use latest localStorage value when showing guide', async () => {
        const mockLatestStorage = {
            trade_types_selection: false,
            trade_page: true,
            positions_page: false,
            market_selector: false,
            trade_param_quick_adjustment: false,
            trade_params: false,
        };

        (getLocalStorage as jest.Mock).mockReturnValue(mockLatestStorage);

        const tradeElement = document.createElement('div');
        tradeElement.className = 'trade';
        document.body.appendChild(tradeElement);

        jest.spyOn(document, 'querySelector').mockReturnValue(tradeElement);

        render(<TradeParamsGuide />);

        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'trade__parameter-tooltip-info';
        tradeElement.appendChild(tooltipElement);

        act(() => {
            jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
            expect(mockSetGuideDtraderV2).toHaveBeenCalledWith({
                ...mockLatestStorage,
                trade_params: true,
            });
        });

        document.body.removeChild(tradeElement);
    });
});
