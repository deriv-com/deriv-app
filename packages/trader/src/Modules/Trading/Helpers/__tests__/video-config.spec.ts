import { TVideo } from 'Modules/Trading/Components/Form/ContractType/types';
import { getDescriptionVideoId, getDescriptionVideos } from '../video-config';

const vanilla_id = 'test_vanilla_video_id';
const turbos_id = 'test_turbos_video_id';
const videos = [
    { meta: { name: 'dtrader_vanilla_description_light.mp4' }, uid: vanilla_id },
    { meta: { name: 'dtrader_turbos_description_light.mp4' }, uid: turbos_id },
] as TVideo[];
const dark_videos = [
    { meta: { name: 'dtrader_vanilla_description_dark.mp4' }, uid: vanilla_id },
    { meta: { name: 'dtrader_turbos_description_dark.mp4' }, uid: turbos_id },
] as TVideo[];

global.fetch = jest.fn(param =>
    Promise.resolve({
        json: () => Promise.resolve({ result: (param as string).includes('dark') ? dark_videos : videos }),
    })
) as jest.Mock;

describe('getDescriptionVideoId', () => {
    it('should return an id for Vanillas description video', () => {
        expect(getDescriptionVideoId(videos, 'vanilla')).toEqual(vanilla_id);
    });
    it('should return an id for Turbos description video', () => {
        expect(getDescriptionVideoId(videos, 'turbos')).toEqual(turbos_id);
    });
    it('should return an empty string when called with empty arguments', () => {
        expect(getDescriptionVideoId()).toEqual('');
    });
});

describe('getDescriptionVideos', () => {
    it('should return an array of light videos when is_dark_mode_on is falsy', async () => {
        expect(await getDescriptionVideos(false)).toEqual(videos);
        expect(await getDescriptionVideos()).toEqual(videos);
    });
    it('should return an array of dark videos when is_dark_mode_on is true', async () => {
        expect(await getDescriptionVideos(true)).toEqual(dark_videos);
    });
    it('should return an empty array when failed to fetch', async () => {
        (fetch as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch')));
        expect(await getDescriptionVideos()).toEqual([]);
    });
});
