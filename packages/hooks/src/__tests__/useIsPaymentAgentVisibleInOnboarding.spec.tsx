import { renderHook } from '@testing-library/react-hooks';
import useAllPaymentAgentList from '../useAllPaymentAgentList';
import useIsPaymentAgentVisibleInOnboarding from '../useIsPaymentAgentVisibleInOnboarding';

jest.mock('../useAllPaymentAgentList', () => jest.fn(() => ({ data: { list: ['PA1', 'PA2'] } })));

describe('useIsPaymentAgentVisibleInOnboarding', () => {
    it('should be true if payment agents list is not empty', () => {
        const { result } = renderHook(() => useIsPaymentAgentVisibleInOnboarding());

        expect(result.current).toBe(true);
    });

    it('should be false if payment agents list is empty', () => {
        useAllPaymentAgentList.mockImplementation(() => ({ data: { list: [] } }));
        const { result } = renderHook(() => useIsPaymentAgentVisibleInOnboarding());

        expect(result.current).toBe(false);
    });
});
