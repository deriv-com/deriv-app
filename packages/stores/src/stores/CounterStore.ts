import { action, observable, makeObservable } from 'mobx';
import { makePersistable, stopPersisting } from 'mobx-persist-store';

export default class CounterStore {
    count = 0;

    constructor() {
        makeObservable(this, {
            count: observable,
            increment: action.bound,
            decrement: action.bound,
            unmount: action.bound,
        });

        makePersistable(this, { name: 'CounterStore', properties: ['count'], storage: window.localStorage });
    }

    increment() {
        this.count = ++this.count;
    }

    decrement() {
        this.count = --this.count;
    }

    unmount() {
        stopPersisting(this);
    }
}
