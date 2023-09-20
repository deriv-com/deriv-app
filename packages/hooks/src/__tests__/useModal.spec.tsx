import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useModal from '../useModal';

describe('useModal', () => {
    const Modal = () => {
        return <div>Modal</div>;
    };

    test('should return is_open and Modal', () => {
        const { result } = renderHook(() => useModal(Modal));

        expect(result.current.modal).not.toBeUndefined();
        expect(result.current.is_open).toBe(false);
    });
});
