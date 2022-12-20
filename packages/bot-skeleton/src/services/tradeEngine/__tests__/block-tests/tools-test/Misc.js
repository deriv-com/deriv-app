import { runAndGetResult } from '../../tools';
import { observer as globalObserver } from '../../../../../utils/observer';

describe('Misc. tools', () => {
    let result;
    const observed = {};

    globalObserver.register('Notify', notify => {
        observed.notify = notify;
    });

    beforeAll(done => {
        runAndGetResult(
            undefined,
            `
        Bot.notify({ message: 'Test', className: 'info'})
        watch('before')
        result.totalRuns = Bot.getTotalRuns();
        result.totalProfit = Bot.getTotalProfit();
        result.balance = Bot.getBalance('NUM')
        result.balanceStr = Bot.getBalance('STR')
    `
        ).then(v => {
            result = v;
            done();
        });
    });
    it('Balance', () => {
        const { balance, balanceStr } = result;

        expect(balance).toBeInstanceOf(Number);
        expect(balanceStr).toBeInstanceOf(String);
        expect(parseFloat(balanceStr)).toBe(balance);
    });

    it('Total Profit', () => {
        const { totalProfit } = result;

        expect(totalProfit).toBeInstanceOf(Number);
    });

    it('Total runs', () => {
        const { totalRuns } = result;

        expect(totalRuns).toBe(0);
    });

    it('Notify', () => {
        const {
            notify: { className, message },
        } = observed;

        expect(className).toBe('info');
        expect(message).toBe('Test');
    });
});
