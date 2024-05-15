// Mock copy-anything module which is causing issues with jest in coveralls
jest.mock('copy-anything', () => ({
    copy: jest.fn(),
}));

jest.mock('@deriv-com/analytics', () => ({
    Analytics: {
        trackEvent: jest.fn(),
        pageView: jest.fn(),
        reset: jest.fn(),
        setAttributes: jest.fn(),
        getFeatureValue: jest.fn(),
        getInstances: jest.fn().mockReturnValue({
            ab: {
                GrowthBook: {
                    setRenderer: jest.fn(),
                },
            },
        }),
    },
}));

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

const mock_onfido = {
    init: jest.fn().mockResolvedValue({}),
};

window.Onfido = mock_onfido;
