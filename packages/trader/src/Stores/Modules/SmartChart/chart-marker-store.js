import { observable, makeObservable } from 'mobx';

export class ChartMarkerStore {
    marker_config = observable.object({});
    content_config = observable.object({});

    constructor(marker_config, content_config) {
        makeObservable(this, {
            marker_config: observable,
            content_config: observable,
        });

        this.marker_config = marker_config;
        this.content_config = content_config;
    }
}
