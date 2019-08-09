import { observable } from 'mobx';

export default class BotStore {
    constructor(ws) {
        this.ws = ws;
    }

    @observable title = 'Hi new bot!';

    /* @action.bound onClick = () => {
        // eslint-disable-next-line
        this.ws.subscribeTicks('R_50', t => console.log(t), false);
    } */
}
