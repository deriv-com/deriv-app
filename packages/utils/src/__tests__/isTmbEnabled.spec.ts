import isTmbEnabled from '../isTmbEnabled';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('isTmbEnabled', () => {
    const originalEnv = process.env.NODE_ENV;

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();

        // Reset process.env.NODE_ENV to production by default
        process.env.NODE_ENV = 'production';
    });

    afterEach(() => {
        // Restore original NODE_ENV
        process.env.NODE_ENV = originalEnv;
    });

    describe('localStorage handling', () => {
        it('should return true when localStorage value is "true"', async () => {
            localStorage.setItem('is_tmb_enabled', 'true');

            // Mock successful API response
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue({ app: false }),
            } as any);

            const result = await isTmbEnabled();

            expect(result).toBe(true);
        });

        it('should return false when localStorage value is "false"', async () => {
            localStorage.setItem('is_tmb_enabled', 'false');

            // Mock successful API response
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue({ app: true }),
            } as any);

            const result = await isTmbEnabled();

            expect(result).toBe(false);
        });

        it('should ignore localStorage for non-boolean string values', async () => {
            localStorage.setItem('is_tmb_enabled', 'maybe');

            // Mock successful API response
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue({ app: true }),
            } as any);

            const result = await isTmbEnabled();

            expect(result).toBe(false); // 'maybe' === 'true' is false
        });
    });

    describe('API calls in production environment', () => {
        beforeEach(() => {
            process.env.NODE_ENV = 'production';
        });

        it('should use production URL and return API result when no localStorage value', async () => {
            const mockResponse = { app: true };
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockResponse),
            } as any);

            const result = await isTmbEnabled();

            expect(mockFetch).toHaveBeenCalledWith(
                'https://app-config-prod.firebaseio.com/remote_config/oauth/is_tmb_enabled.json'
            );
            expect(result).toBe(true);
        });

        it('should return false when API returns false', async () => {
            const mockResponse = { app: false };
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockResponse),
            } as any);

            const result = await isTmbEnabled();

            expect(result).toBe(false);
        });

        it('should return true when API returns truthy value', async () => {
            const mockResponse = { app: 1 };
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockResponse),
            } as any);

            const result = await isTmbEnabled();

            expect(result).toBe(true);
        });

        it('should return false when API returns undefined app value', async () => {
            const mockResponse = {};
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockResponse),
            } as any);

            const result = await isTmbEnabled();

            expect(result).toBe(false);
        });

        it('should return false when API returns null app value', async () => {
            const mockResponse = { app: null };
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockResponse),
            } as any);

            const result = await isTmbEnabled();

            expect(result).toBe(false);
        });
    });

    describe('API calls in non-production environment', () => {
        beforeEach(() => {
            process.env.NODE_ENV = 'development';
        });

        it('should use staging URL in development environment', async () => {
            const mockResponse = { app: true };
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockResponse),
            } as any);

            const result = await isTmbEnabled();

            expect(mockFetch).toHaveBeenCalledWith(
                'https://app-config-staging.firebaseio.com/remote_config/oauth/is_tmb_enabled.json'
            );
            expect(result).toBe(true);
        });

        it('should use staging URL in test environment', async () => {
            process.env.NODE_ENV = 'test';

            const mockResponse = { app: false };
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockResponse),
            } as any);

            const result = await isTmbEnabled();

            expect(mockFetch).toHaveBeenCalledWith(
                'https://app-config-staging.firebaseio.com/remote_config/oauth/is_tmb_enabled.json'
            );
            expect(result).toBe(false);
        });
    });

    describe('error handling', () => {
        it('should return true on fetch error when no localStorage value', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await isTmbEnabled();

            expect(result).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith(new Error('Network error'));

            consoleSpy.mockRestore();
        });

        it('should return localStorage value on fetch error when localStorage exists', async () => {
            localStorage.setItem('is_tmb_enabled', 'false');
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await isTmbEnabled();

            expect(result).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith(new Error('Network error'));

            consoleSpy.mockRestore();
        });

        it('should return true on JSON parsing error when no localStorage value', async () => {
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockRejectedValue(new Error('JSON parse error')),
            } as any);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await isTmbEnabled();

            expect(result).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith(new Error('JSON parse error'));

            consoleSpy.mockRestore();
        });

        it('should return localStorage value on JSON parsing error when localStorage exists', async () => {
            localStorage.setItem('is_tmb_enabled', 'true');
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockRejectedValue(new Error('JSON parse error')),
            } as any);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await isTmbEnabled();

            expect(result).toBe(true);
            expect(consoleSpy).toHaveBeenCalledWith(new Error('JSON parse error'));

            consoleSpy.mockRestore();
        });
    });

    describe('combined localStorage and API behavior', () => {
        it('should prioritize localStorage over API when localStorage is "true"', async () => {
            localStorage.setItem('is_tmb_enabled', 'true');

            const mockResponse = { app: false };
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockResponse),
            } as any);

            const result = await isTmbEnabled();

            expect(result).toBe(true); // localStorage value takes precedence
        });

        it('should prioritize localStorage over API when localStorage is "false"', async () => {
            localStorage.setItem('is_tmb_enabled', 'false');

            const mockResponse = { app: true };
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockResponse),
            } as any);

            const result = await isTmbEnabled();

            expect(result).toBe(false); // localStorage value takes precedence
        });

        it('should fall back to API when localStorage is null', async () => {
            // No localStorage value set

            const mockResponse = { app: true };
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockResponse),
            } as any);

            const result = await isTmbEnabled();

            expect(result).toBe(true); // API value used
        });
    });

    describe('edge cases', () => {
        it('should handle localStorage with empty string', async () => {
            localStorage.setItem('is_tmb_enabled', '');

            const mockResponse = { app: true };
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockResponse),
            } as any);

            const result = await isTmbEnabled();

            expect(result).toBe(false); // Empty string !== 'true', so returns false when localStorage is not null
        });

        it('should handle fetch returning non-Response object', async () => {
            mockFetch.mockResolvedValueOnce(null as any);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await isTmbEnabled();

            expect(result).toBe(false); // Default fallback
            expect(consoleSpy).toHaveBeenCalled();

            consoleSpy.mockRestore();
        });

        it('should handle response.json() returning non-object', async () => {
            mockFetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue('invalid json'),
            } as any);

            const result = await isTmbEnabled();

            expect(result).toBe(false); // !!result.app where result.app is undefined
        });
    });
});
