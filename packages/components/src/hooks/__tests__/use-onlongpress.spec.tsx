import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useLongPress } from '../use-onlongpress';
import { act } from '@testing-library/react';

describe('useLongPress', () => {
    let preventDefault: () => void, stopPropagation: () => void;
    let event = {} as React.MouseEvent & React.TouchEvent;
    beforeEach(() => {
        preventDefault = jest.fn();
        stopPropagation = jest.fn();
        event = {
            ...event,
            preventDefault,
            stopPropagation,
        };
    });
    it('should return event handlers', () => {
        const { result } = renderHook(() => useLongPress(jest.fn(), 300));
        expect(result.current).toHaveProperty('onMouseDown');
        expect(result.current).toHaveProperty('onMouseUp');
        expect(result.current).toHaveProperty('onMouseLeave');
        expect(result.current).toHaveProperty('onTouchStart');
        expect(result.current).toHaveProperty('onTouchEnd');
    });
    it('should call preventDefault() and stopPropagation() when onMouseDown is triggered', () => {
        const { result } = renderHook(() => useLongPress(jest.fn(), 300));
        act(() => {
            result.current.onMouseDown(event);
        });
        expect(preventDefault).toBeCalledTimes(1);
        expect(stopPropagation).toBeCalledTimes(1);
    });
    it('should not call preventDefault() or stopPropagation() when onMouseUp is triggered', () => {
        const { result } = renderHook(() => useLongPress(jest.fn(), 300));
        act(() => {
            result.current.onMouseUp();
        });
        expect(preventDefault).not.toBeCalled();
        expect(stopPropagation).not.toBeCalled();
    });
    it('should not call preventDefault() or stopPropagation() when onMouseLeave is triggered', () => {
        const { result } = renderHook(() => useLongPress(jest.fn(), 300));
        act(() => {
            result.current.onMouseLeave();
        });
        expect(preventDefault).not.toBeCalled();
        expect(stopPropagation).not.toBeCalled();
    });
    it('should not call preventDefault() or stopPropagation() when onTouchStart is triggered', () => {
        const { result } = renderHook(() => useLongPress(jest.fn(), 300));
        act(() => {
            result.current.onTouchStart();
        });
        expect(preventDefault).not.toBeCalled();
        expect(stopPropagation).not.toBeCalled();
    });
    it('should not call preventDefault() or stopPropagation() when onTouchEnd is triggered', () => {
        const { result } = renderHook(() => useLongPress(jest.fn(), 300));
        act(() => {
            result.current.onTouchEnd();
        });
        expect(preventDefault).not.toBeCalled();
        expect(stopPropagation).not.toBeCalled();
    });
});
