import { renderHook } from '@testing-library/react-hooks';
import useFileUploader from '../useFileUploader'; // Replace with the actual import path
import * as fileUtils from '@deriv/shared';

jest.mock('@binary-com/binary-document-uploader');

jest.mock('@deriv/shared', () => {
    return {
        WS: {
            getSocket: jest.fn().mockReturnValue({}),
        },
        compressImageFiles: jest.fn().mockResolvedValue([]),
        readFiles: jest.fn().mockResolvedValue([]),
    };
});

describe('useFileUploader', () => {
    it('should initialize without error', () => {
        const { result } = renderHook(() => useFileUploader());
        expect(result.error).toBeUndefined();
    });

    it('should upload files successfully', async () => {
        const { result } = renderHook(() => useFileUploader());
        const file = new File(['file contents'], 'file.pdf', { type: 'application/pdf' });
        jest.spyOn(fileUtils, 'compressImageFiles').mockResolvedValue([file]);

        // @ts-expect-error types are correct according to FileUploader
        jest.spyOn(fileUtils, 'readFiles').mockResolvedValue([file]);
        jest.spyOn(result.current.uploader_instance, 'upload').mockResolvedValue({});
        const uploadPromise = result.current.upload([file]);

        await expect(uploadPromise).resolves.toEqual({});
    });

    it('should handle file upload errors', async () => {
        const { result } = renderHook(() => useFileUploader());
        const error_message = 'Something went wrong!';
        const file = new File(['file contents'], 'file.pdf', { type: 'application/pdf' });
        jest.spyOn(result.current.uploader_instance, 'upload').mockRejectedValue(new Error(error_message));
        const uploadPromise = result.current.upload([file], undefined);

        await expect(uploadPromise).rejects.toThrow(error_message);
    });
});
