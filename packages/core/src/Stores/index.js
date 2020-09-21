import React from 'react';
import ClientStore from './client-store';
import CommonStore from './common-store';
import GTMStore from './gtm-store';
import SegmentStore from './segment-store';
import ModulesStore from './Modules';
import UIStore from './ui-store';
import { PlatformContext } from '@deriv/shared';

export default class RootStore {
    constructor(platform_context) {
        this.platform = platform_context;
        this.client = new ClientStore(this);
        this.common = new CommonStore(this);
        this.modules = new ModulesStore(this);
        this.ui = new UIStore(this);
        this.gtm = new GTMStore(this);
        this.segment = new SegmentStore(this);
    }
}
