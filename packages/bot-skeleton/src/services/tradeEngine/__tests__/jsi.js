import Interpreter from '../utils/interpreter';

const interpreter = new Interpreter();

describe('Run Interpreter over simple calculation', () => {
    let value;

    beforeAll(done => {
        interpreter.run('1 + 2').then(v => {
            value = v;
            done();
        });
    });

    it('Pure js code should be validated correctly', () => {
        expect(value).toBe(3);
    });
});
