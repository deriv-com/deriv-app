import {
    CF_STREAM_CUSTOMER_URL,
    DESCRIPTION_VIDEO_ID,
    getDescriptionVideoId,
    getVideoDownloadUrl,
} from '../video-config';

describe('getDescriptionVideoId', () => {
    it('should return an id for Vanillas description video in light theme', () => {
        expect(getDescriptionVideoId('vanilla', false)).toEqual(DESCRIPTION_VIDEO_ID.vanilla.light);
    });
    it('should return an id for Turbos description video in dark theme', () => {
        expect(getDescriptionVideoId('turbos', true)).toEqual(DESCRIPTION_VIDEO_ID.turbos.dark);
    });
    it('should return undefined when called with empty arguments', () => {
        expect(getDescriptionVideoId()).toEqual(undefined);
    });
});

describe('getVideoDownloadUrl', () => {
    it('should return a download URL for Vanillas description video in light theme', () => {
        expect(getVideoDownloadUrl('vanilla', false)).toEqual(
            `${CF_STREAM_CUSTOMER_URL}${DESCRIPTION_VIDEO_ID.vanilla.light}/downloads/default.mp4`
        );
    });
    it('should return an empty string if called with empty arguments', () => {
        expect(getVideoDownloadUrl()).toEqual('');
    });
});
