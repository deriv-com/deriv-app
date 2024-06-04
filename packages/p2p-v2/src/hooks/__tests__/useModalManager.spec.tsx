import * as React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { useDevice } from '@deriv-com/ui';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useModalManager from '../useModalManager';
import useQueryString from '../useQueryString';

const mockReplace = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
        replace: mockReplace,
    }),
}));

const mockedUseQueryString = useQueryString as jest.MockedFunction<typeof useQueryString>;
jest.mock('@/hooks/useQueryString', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        deleteQueryString: jest.fn(),
        queryString: {},
        setQueryString: jest.fn(),
    })),
}));

const mockedUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;
jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockImplementation(() => ({
        isMobile: false,
    })),
}));

let windowLocationSpy: jest.SpyInstance<Location, []>;

describe('useModalManager', () => {
    beforeEach(() => {
        windowLocationSpy = jest.spyOn(window, 'location', 'get');
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should render and show the correct modal states when showModal is called', async () => {
        const history = createMemoryHistory();
        const originalLocation = window.location;
        const wrapper = ({ children }: { children: JSX.Element }) => {
            return <Router history={history}>{children}</Router>;
        };

        const { rerender, result } = renderHook(() => useModalManager(), { wrapper });

        expect(result.current.isModalOpenFor('ModalA')).toBe(false);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);

        act(() => {
            result.current.showModal('ModalA');
        });
        expect(result.current.isModalOpenFor('ModalA')).toBe(true);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);

        windowLocationSpy.mockImplementationOnce(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA',
            search: '?modal=ModalA',
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            deleteQueryString: jest.fn(),
            queryString: {
                modal: 'ModalA',
                advertId: undefined,
                formAction: undefined,
                paymentMethodId: undefined,
                tab: undefined,
            },
            setQueryString: jest.fn(),
        }));
        rerender();

        act(() => {
            result.current.showModal('ModalB');
        });

        expect(result.current.isModalOpenFor('ModalA')).toBe(false);
        expect(result.current.isModalOpenFor('ModalB')).toBe(true);

        windowLocationSpy.mockImplementationOnce(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA,ModalB',
            search: '?modal=ModalA,ModalB',
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            deleteQueryString: jest.fn(),
            queryString: {
                modal: 'ModalA,ModalB',
                advertId: undefined,
                formAction: undefined,
                paymentMethodId: undefined,
                tab: undefined,
            },
            setQueryString: jest.fn(),
        }));
        rerender();

        act(() => {
            result.current.showModal('ModalC');
        });

        expect(result.current.isModalOpenFor('ModalA')).toBe(false);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);
        expect(result.current.isModalOpenFor('ModalC')).toBe(true);
    });
    it('should hide the modals and show previous modal when current modal hidden', () => {
        const history = createMemoryHistory();
        const wrapper = ({ children }: { children: JSX.Element }) => {
            return <Router history={history}>{children}</Router>;
        };

        const { rerender, result } = renderHook(() => useModalManager(), { wrapper });

        expect(result.current.isModalOpenFor('ModalA')).toBe(false);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);

        act(() => {
            result.current.showModal('ModalA');
        });
        expect(result.current.isModalOpenFor('ModalA')).toBe(true);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);

        const originalLocation = window.location;
        windowLocationSpy.mockImplementationOnce(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA',
            search: '?modal=ModalA',
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            queryString: {
                modal: 'ModalA',
            },
            setQueryString: jest.fn(),
            deleteQueryString: jest.fn(),
        }));
        rerender();

        act(() => {
            result.current.showModal('ModalB');
        });

        windowLocationSpy.mockImplementation(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA,ModalB',
            search: '?modal=ModalA,ModalB',
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            queryString: {
                modal: 'ModalA,ModalB',
            },
            setQueryString: jest.fn(),
            deleteQueryString: jest.fn(),
        }));
        rerender();

        act(() => {
            result.current.hideModal();
        });
        expect(result.current.isModalOpenFor('ModalA')).toBe(true);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);

        windowLocationSpy.mockImplementationOnce(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA',
            search: '?modal=ModalA',
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            queryString: {
                modal: 'ModalA',
                advertId: undefined,
                formAction: undefined,
                paymentMethodId: undefined,
                tab: undefined,
            },
            setQueryString: jest.fn(),
            deleteQueryString: jest.fn(),
        }));
        rerender();

        act(() => {
            result.current.hideModal();
        });
        expect(result.current.isModalOpenFor('ModalA')).toBe(false);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);
    });
    it('should show the modals when URL is initialized with default modal states', () => {
        const history = createMemoryHistory();
        const wrapper = ({ children }: { children: JSX.Element }) => {
            return <Router history={history}>{children}</Router>;
        };

        const originalLocation = window.location;
        windowLocationSpy.mockImplementationOnce(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA,ModalB,ModalC',
            search: '?modal=ModalA,ModalB,ModalC',
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            queryString: {
                modal: 'ModalA,ModalB,ModalC',
                advertId: undefined,
                formAction: undefined,
                paymentMethodId: undefined,
                tab: undefined,
            },
            setQueryString: jest.fn(),
            deleteQueryString: jest.fn(),
        }));

        const { result } = renderHook(() => useModalManager(), { wrapper });

        expect(result.current.isModalOpenFor('ModalA')).toBe(false);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);
        expect(result.current.isModalOpenFor('ModalC')).toBe(true);
    });
    it('should should not show the modals on navigated back when shouldReinitializeModals is set to false', () => {
        const history = createMemoryHistory();
        const wrapper = ({ children }: { children: JSX.Element }) => {
            return <Router history={history}>{children}</Router>;
        };

        const originalLocation = window.location;
        windowLocationSpy.mockImplementationOnce(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA,ModalB,ModalC',
            search: '?modal=ModalA,ModalB,ModalC',
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            queryString: {
                modal: 'ModalA,ModalB,ModalC',
            },
            setQueryString: jest.fn(),
            deleteQueryString: jest.fn(),
        }));

        const { result } = renderHook(
            () =>
                useModalManager({
                    shouldReinitializeModals: false,
                }),
            { wrapper }
        );

        expect(result.current.isModalOpenFor('ModalA')).toBe(false);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);
        expect(result.current.isModalOpenFor('ModalC')).toBe(false);
    });
    it('should should show the modals on navigated back when shouldReinitializeModals is set to true', () => {
        const history = createMemoryHistory();
        const wrapper = ({ children }: { children: JSX.Element }) => {
            return <Router history={history}>{children}</Router>;
        };

        const originalLocation = window.location;
        windowLocationSpy.mockImplementationOnce(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA,ModalB,ModalC',
            search: '?modal=ModalA,ModalB,ModalC',
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            queryString: {
                modal: 'ModalA,ModalB,ModalC',
                advertId: undefined,
                formAction: undefined,
                paymentMethodId: undefined,
                tab: undefined,
            },
            setQueryString: jest.fn(),
            deleteQueryString: jest.fn(),
        }));

        const { result } = renderHook(
            () =>
                useModalManager({
                    shouldReinitializeModals: true,
                }),
            { wrapper }
        );

        expect(result.current.isModalOpenFor('ModalA')).toBe(false);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);
        expect(result.current.isModalOpenFor('ModalC')).toBe(true);
    });
    it('should should stack the modals in mobile', () => {
        const history = createMemoryHistory();
        const wrapper = ({ children }: { children: JSX.Element }) => {
            return <Router history={history}>{children}</Router>;
        };

        const originalLocation = window.location;
        windowLocationSpy.mockImplementationOnce(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA,ModalB,ModalC',
            search: '?modal=ModalA,ModalB,ModalC',
        }));
        mockedUseDevice.mockImplementation(() => ({
            isMobile: true,
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            queryString: {
                modal: 'ModalA,ModalB,ModalC',
            },
            setQueryString: jest.fn(),
            deleteQueryString: jest.fn(),
        }));

        const { result } = renderHook(() => useModalManager(), { wrapper });

        expect(result.current.isModalOpenFor('ModalA')).toBe(true);
        expect(result.current.isModalOpenFor('ModalB')).toBe(true);
        expect(result.current.isModalOpenFor('ModalC')).toBe(true);

        act(() => {
            result.current.showModal('ModalD');
        });

        expect(result.current.isModalOpenFor('ModalA')).toBe(true);
        expect(result.current.isModalOpenFor('ModalB')).toBe(true);
        expect(result.current.isModalOpenFor('ModalC')).toBe(true);
        expect(result.current.isModalOpenFor('ModalD')).toBe(true);
    });
});
