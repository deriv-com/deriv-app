import {
    ACCU_MANUAL_VIDEO_ID,
    CF_STREAM_CUSTOMER_URL,
    DESCRIPTION_VIDEO_ID,
    getAccuManualVideoId,
    getDescriptionVideoId,
    getVideoDownloadUrl,
} from '../video-config';

describe('getAccuManualVideoId', () => {
    it('should return AccumulatorsStatsManualModal video id for desktop in light theme', () => {
        expect(getAccuManualVideoId(false, false)).toEqual(ACCU_MANUAL_VIDEO_ID.desktop.light);
    });
    it('should return AccumulatorsStatsManualModal video id for desktop in dark theme', () => {
        expect(getAccuManualVideoId(false, true)).toEqual(ACCU_MANUAL_VIDEO_ID.desktop.dark);
    });
    it('should return AccumulatorsStatsManualModal video id for mobile in dark theme', () => {
        expect(getAccuManualVideoId(true, true)).toEqual(ACCU_MANUAL_VIDEO_ID.mobile.dark);
    });
    it('should return AccumulatorsStatsManualModal video id for mobile in light theme', () => {
        expect(getAccuManualVideoId(true, false)).toEqual(ACCU_MANUAL_VIDEO_ID.mobile.light);
    });
    it('should return AccumulatorsStatsManualModal video id for desktop in light theme when arguments are empty', () => {
        expect(getAccuManualVideoId()).toEqual(ACCU_MANUAL_VIDEO_ID.desktop.light);
    });
});

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
