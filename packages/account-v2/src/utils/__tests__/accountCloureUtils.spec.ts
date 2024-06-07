import {
    getAccountClosureReasons,
    getAccountClosureValidationSchema,
    validateAccountClosure,
} from '../accountClosureUtils';

describe('getAccountClosureValidationSchema', () => {
    const mockFormData = {
        ...getAccountClosureValidationSchema().getDefault(),
        anotherWebsite: true,
        difficultTransactions: true,
        doToImprove: 'test',
    };

    it('should return a Yup object schema', () => {
        const schema = getAccountClosureValidationSchema();

        expect(schema).toBeDefined();
        expect(schema.isValidSync(mockFormData)).toBeTruthy();
    });

    it('should return a Yup object schema with default values', () => {
        const schema = getAccountClosureValidationSchema();

        expect(schema.getDefault()).toEqual({
            anotherWebsite: false,
            difficultTransactions: false,
            doToImprove: '',
            financialPriorities: false,
            lackOfFeatures: false,
            notInterested: false,
            notUserFriendly: false,
            otherReasons: false,
            otherTradingPlatforms: '',
            stopTrading: false,
            unsatisfactoryService: false,
        });
    });
});

describe('validateAccountClosure', () => {
    it('should return true when form is dirty with some reasons selected', () => {
        const mockFormData = {
            ...getAccountClosureValidationSchema().getDefault(),
            anotherWebsite: true,
            difficultTransactions: true,
            doToImprove: 'test',
        };

        const result = validateAccountClosure(mockFormData, true);

        expect(result).toBeTruthy();
    });

    it('should return false when form is dirty but no reasons are selected', () => {
        const mockFormData = getAccountClosureValidationSchema().getDefault();

        const result = validateAccountClosure(mockFormData, true);

        expect(result).toBeFalsy();
    });

    it('should return true when form is not dirty', () => {
        const mockFormData = getAccountClosureValidationSchema().getDefault();

        const result = validateAccountClosure(mockFormData, false);

        expect(result).toBeTruthy();
    });

    it('should return false when form is dirty but only user types in text area', () => {
        const mockFormData = {
            ...getAccountClosureValidationSchema().getDefault(),
            doToImprove: 'test',
        };

        const result = validateAccountClosure(mockFormData, true);

        expect(result).toBeFalsy();
    });
});

describe('getAccountClosureReasons', () => {
    it('should return an array of reasons based on selected form values', () => {
        const mockFormData = {
            ...getAccountClosureValidationSchema().getDefault(),
            anotherWebsite: true,
            difficultTransactions: true,
            doToImprove: 'test',
        };

        const processedData = 'another-website,difficult-transactions,test';
        const result = getAccountClosureReasons(mockFormData);

        expect(result).toEqual(processedData);
    });
});
