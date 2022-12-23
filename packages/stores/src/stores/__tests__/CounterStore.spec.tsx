import CounterStore from '../CounterStore';

describe('CounterStore', () => {
    it('should have initial value of zero', () => {
        const store = new CounterStore();

        expect(store.count).toBe(0);
    });

    it('should increment the counter 3 times', () => {
        const store = new CounterStore();

        store.increment();
        store.increment();
        store.increment();

        expect(store.count).toBe(3);
    });

    it('should increment and decrement the counter with random order and have the correct value', () => {
        const store = new CounterStore();

        store.increment();
        store.increment();
        store.increment();
        store.decrement();
        store.decrement();
        store.increment();
        store.decrement();

        expect(store.count).toBe(1);
    });
});
