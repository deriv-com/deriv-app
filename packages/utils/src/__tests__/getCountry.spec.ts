import getCountry from '../getCountry';

describe('getCountry', () => {
    let fetchSpy: jest.SpyInstance;

    beforeEach(() => {
        fetchSpy = jest.spyOn(global, 'fetch');
    });

    afterEach(() => {
        fetchSpy.mockRestore();
    });

    it('should return the country code in lowercase when available', async () => {
        fetchSpy.mockResolvedValue({
            text: async () => 'loc=US\nother=info\n',
        } as Response);

        const country = await getCountry();
        expect(country).toBe('us');
    });

    it('should return an empty string if the loc field is not present', async () => {
        fetchSpy.mockResolvedValue({
            text: async () => 'other=info\n',
        } as Response);

        const country = await getCountry();
        expect(country).toBe('');
    });

    it('should return an empty string if the fetch fails', async () => {
        fetchSpy.mockRejectedValue(new Error('Fetch failed'));

        const country = await getCountry();
        expect(country).toBe('');
    });
});
