import { act } from '@testing-library/react';
import useGuideStates from '../useGuideStates';
import { renderHook } from '@testing-library/react-hooks';

describe('useGuideStates', () => {
    beforeEach(() => {
        act(() => {
            const { result } = renderHook(() => useGuideStates());
            result.current.setGuideState('should_run_trade_page_guide', false);
            result.current.setGuideState('should_run_market_selector_guide', false);
        });
    });
    it('should initialize with default values', () => {
        const { result } = renderHook(() => useGuideStates());

        expect(result.current.guideStates).toEqual({
            should_run_trade_page_guide: false,
            should_run_market_selector_guide: false,
        });
    });
    it('should update guide state when setGuideState is called', () => {
        const { result } = renderHook(() => useGuideStates());

        act(() => {
            result.current.setGuideState('should_run_trade_page_guide', true);
        });

        expect(result.current.guideStates.should_run_trade_page_guide).toBe(true);
        expect(result.current.guideStates.should_run_market_selector_guide).toBe(false);
    });
    it('should maintain state across multiple hook instances', () => {
        const { result: result1 } = renderHook(() => useGuideStates());
        const { result: result2 } = renderHook(() => useGuideStates());

        act(() => {
            result1.current.setGuideState('should_run_market_selector_guide', true);
        });

        expect(result1.current.guideStates.should_run_market_selector_guide).toBe(true);
        expect(result2.current.guideStates.should_run_market_selector_guide).toBe(true);
    });
    it('should update all instances when state changes', () => {
        const { result: result1 } = renderHook(() => useGuideStates());
        const { result: result2 } = renderHook(() => useGuideStates());

        act(() => {
            result1.current.setGuideState('should_run_trade_page_guide', true);
        });

        expect(result1.current.guideStates.should_run_trade_page_guide).toBe(true);
        expect(result2.current.guideStates.should_run_trade_page_guide).toBe(true);
    });
    it('should handle multiple state updates', () => {
        const { result } = renderHook(() => useGuideStates());

        act(() => {
            result.current.setGuideState('should_run_trade_page_guide', true);
            result.current.setGuideState('should_run_market_selector_guide', true);
        });

        expect(result.current.guideStates).toEqual({
            should_run_trade_page_guide: true,
            should_run_market_selector_guide: true,
        });
    });
    it('should cleanup listeners on unmount', () => {
        const { unmount } = renderHook(() => useGuideStates());
        const listenersSpy = jest.spyOn(Set.prototype, 'delete');

        unmount();

        expect(listenersSpy).toHaveBeenCalled();
    });
    it('should maintain independent updates for different flags', () => {
        const { result } = renderHook(() => useGuideStates());

        act(() => {
            result.current.setGuideState('should_run_trade_page_guide', true);
        });

        expect(result.current.guideStates.should_run_trade_page_guide).toBe(true);
        expect(result.current.guideStates.should_run_market_selector_guide).toBe(false);

        act(() => {
            result.current.setGuideState('should_run_market_selector_guide', true);
        });

        expect(result.current.guideStates.should_run_trade_page_guide).toBe(true);
        expect(result.current.guideStates.should_run_market_selector_guide).toBe(true);
    });
    it('should handle rapid consecutive updates', () => {
        const { result } = renderHook(() => useGuideStates());

        act(() => {
            result.current.setGuideState('should_run_trade_page_guide', true);
            result.current.setGuideState('should_run_trade_page_guide', false);
            result.current.setGuideState('should_run_trade_page_guide', true);
        });

        expect(result.current.guideStates.should_run_trade_page_guide).toBe(true);
    });
    it('should notify all listeners when state changes', () => {
        const { result: result1 } = renderHook(() => useGuideStates());
        const { result: result2 } = renderHook(() => useGuideStates());
        const { result: result3 } = renderHook(() => useGuideStates());

        act(() => {
            result1.current.setGuideState('should_run_trade_page_guide', true);
        });

        [result1, result2, result3].forEach(result => {
            expect(result.current.guideStates.should_run_trade_page_guide).toBe(true);
        });
    });
});
