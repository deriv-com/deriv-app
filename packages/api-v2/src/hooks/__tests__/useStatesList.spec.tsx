import { renderHook } from '@testing-library/react-hooks';
import useQuery from '../../useQuery';
import useStatesList from '../useStatesList';

jest.mock('../../useQuery');

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery<'states_list'>>;

describe('useStatesList', () => {
    it('should return an empty array when the store is not ready', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseQuery.mockReturnValue({
            data: {
                states_list: [],
            },
        });
        const { result } = renderHook(() => useStatesList('in'));

        expect(result.current.data).toHaveLength(0);
    });

    it('should return data fetched along with correct status', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseQuery.mockReturnValue({
            data: {
                states_list: [
                    { text: 'state 1', value: 's1' },
                    { text: 'state 2', value: 's2' },
                ],
            },
            isFetched: true,
        });
        const { result } = renderHook(() => useStatesList('in'));
        expect(result.current.isFetched).toBeTruthy();
    });

    it('should call the useQuery with options if passed', () => {
        renderHook(() => useStatesList('in', { enabled: false }));
        expect(mockUseQuery).toHaveBeenCalledWith('states_list', {
            payload: { states_list: 'in' },
            options: { enabled: false },
        });
    });
});
