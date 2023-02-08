import { RefObject, useEffect, useRef } from 'react';

import useIsomorphicLayoutEffect from './use-isomorphic-layout-effect';

// MediaQueryList Event based useEventListener interface
function useEventListener<K extends keyof MediaQueryListEventMap>(
    eventName: K,
    handler: (event: MediaQueryListEventMap[K]) => void,
    element: RefObject<MediaQueryList>,
    options?: boolean | AddEventListenerOptions
): void;

// Window Event based useEventListener interface
function useEventListener<K extends keyof WindowEventMap>(
    eventName: K,
    handler: (event: WindowEventMap[K]) => void,
    element?: undefined,
    options?: boolean | AddEventListenerOptions
): void;

// Element Event based useEventListener interface
function useEventListener<K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLDivElement>(
    eventName: K,
    handler: (event: HTMLElementEventMap[K]) => void,
    element: RefObject<T>,
    options?: boolean | AddEventListenerOptions
): void;

// Document Event based useEventListener interface
function useEventListener<K extends keyof DocumentEventMap>(
    eventName: K,
    handler: (event: DocumentEventMap[K]) => void,
    element: RefObject<Document>,
    options?: boolean | AddEventListenerOptions
): void;

function useEventListener<
    KW extends keyof WindowEventMap,
    KH extends keyof HTMLElementEventMap,
    KM extends keyof MediaQueryListEventMap,
    T extends HTMLElement | MediaQueryList | void = void
>(
    eventName: KW | KH | KM,
    handler: (event: WindowEventMap[KW] | HTMLElementEventMap[KH] | MediaQueryListEventMap[KM] | Event) => void,
    element?: RefObject<T>,
    options?: boolean | AddEventListenerOptions
) {
    // Create a ref that stores handler
    const savedHandler = useRef(handler);

    useIsomorphicLayoutEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        let targetElement: T | Window, listener: typeof handler;
        const setListener = () => {
            targetElement = element?.current ?? window;
            listener = event => savedHandler.current(event);
            // Define the listening target

            if (!(targetElement && targetElement.addEventListener)) return;

            // Create event listener that calls handler function stored in ref

            targetElement.addEventListener(eventName, listener, options);
        };

        setListener();

        // Remove event listener on cleanup
        return () => {
            targetElement?.removeEventListener(eventName, listener, options);
        };
    }, [eventName, element, options]);
}

export default useEventListener;
