const expect            = require('chai').expect;
const moment            = require('moment');
const shouldForceReload = require('../check_new_release').shouldForceReload;

describe('checkNewRelease', () => {
    describe('.shouldForceReload()', () => {
        it('will not force reload if last reload is less than ten minutes ago', () => {
            expect(shouldForceReload(moment().add(-2, 'minutes').valueOf())).to.eq(false);
            expect(shouldForceReload(moment().add(-9, 'minutes').valueOf())).to.eq(false);
        });
        it('will force reload if last reload is more than ten minutes ago', () => {
            expect(shouldForceReload(moment().add(-11, 'minutes').valueOf())).to.eq(true);
            expect(shouldForceReload(moment().add(-1, 'hour').valueOf())).to.eq(true);
        });
    });
});
