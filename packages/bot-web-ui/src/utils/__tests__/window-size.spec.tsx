import React from 'react';
import { render, screen } from '@testing-library/react';
import {
    getMainContentHeight,
    getMainContentWidth,
    setMainContentWidth,
    setInnerHeightToVariable,
} from '../window-size';

describe('DOM utilities of window-size file', () => {
    beforeEach(() => {
        render(<div className='bot' data-testid='mock-bot' />);
    });

    it('Should get main content height', () => {
        const bot_element = screen.getByTestId('mock-bot');

        bot_element.style.setProperty('--bot-content-height', '100px');

        expect(getMainContentHeight()).toBe('100px');
    });

    it('Should get main content width', () => {
        const bot_element = screen.getByTestId('mock-bot');

        bot_element.style.setProperty('--bot-content-width', '200px');

        expect(getMainContentWidth()).toBe('200px');
    });

    it('Should set main content width based on is_run_panel_open', () => {
        const bot_element = screen.getByTestId('mock-bot');

        setMainContentWidth(true);
        expect(bot_element).toHaveStyle('--bot-content-width: calc(100vw - 366px)');

        setMainContentWidth(false);
        expect(bot_element).toHaveStyle('--bot-content-width: calc(100vw - 16px)');
    });

    it('Should set inner height to --vh variable', () => {
        Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });
        setInnerHeightToVariable();

        expect(document.body).toHaveStyle('--vh: 768px');
    });
});
