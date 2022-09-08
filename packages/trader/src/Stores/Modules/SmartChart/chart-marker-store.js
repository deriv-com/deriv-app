import { observable } from 'mobx';

export class ChartMarkerStore {
    @observable marker_config = observable.object({});
    @observable content_config = observable.object({});

    constructor(marker_config, content_config) {
        this.marker_config = marker_config;
        this.content_config = content_config;
    }
}
