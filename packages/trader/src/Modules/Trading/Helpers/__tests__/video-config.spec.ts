import { TVideo } from 'Modules/Trading/Components/Form/ContractType/types';
import { getDescriptionVideoId } from '../video-config';

const vanilla_id = 'test_vanilla_video_id';
const turbos_id = 'test_turbos_video_id';
const videos = [
    { meta: { name: 'dtrader_vanilla_description_light.mp4' }, uid: vanilla_id },
    { meta: { name: 'dtrader_turbos_description_light.mp4' }, uid: turbos_id },
] as TVideo[];

describe('getDescriptionVideoId', () => {
    it('should return an id for Vanillas description video', () => {
        expect(getDescriptionVideoId(videos, 'vanilla')).toEqual(vanilla_id);
    });
    it('should return an id for Turbos description video', () => {
        expect(getDescriptionVideoId(videos, 'turbos')).toEqual(turbos_id);
    });
    it('should return empty string when called with empty arguments', () => {
        expect(getDescriptionVideoId()).toEqual('');
    });
});
