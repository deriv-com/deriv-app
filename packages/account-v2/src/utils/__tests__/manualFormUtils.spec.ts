import { MANUAL_DOCUMENT_TYPES } from '../../constants/manualFormConstants';
import { getManualFormValidationSchema } from '../manualFormUtils';

describe('getManualFormValidationSchema', () => {
    it('should return correct validation schema', () => {
        const validationSchema = getManualFormValidationSchema(MANUAL_DOCUMENT_TYPES.drivingLicence, true);

        expect(validationSchema.getDefaultFromShape()).toEqual({
            back: null,
            documentExpiry: '',
            documentNumber: '',
            front: null,
        });
    });

    it('should validate the user input for all fields', async () => {
        const validationSchema = getManualFormValidationSchema(MANUAL_DOCUMENT_TYPES.passport, true);

        const result = await validationSchema.isValid({
            documentExpiry: '2020-12-12',
            documentNumber: '123',
            front: new File([], 'front.png'),
        });

        expect(result).toBeTruthy();
    });
});
