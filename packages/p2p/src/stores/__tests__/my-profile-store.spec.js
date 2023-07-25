import MyProfileStore from '../my-profile-store';

describe('MyProfileStore', () => {
    let my_profile_store;

    beforeEach(() => {
        my_profile_store = new MyProfileStore();
    });
    it('should return bank transfer method if upi method is present', () => {
        my_profile_store.advertiser_payment_methods = {
            42: {
                is_enabled: 1,
                method: 'upi',
                type: 'bank',
                used_by_adverts: null,
                used_by_orders: null,
            },
        };

        const expected = [{ method: 'bank_transfer', display_name: 'Bank Transfer' }];
        expect(my_profile_store.payment_methods_list_methods).toEqual(expect.arrayContaining(expected));
    });
});
