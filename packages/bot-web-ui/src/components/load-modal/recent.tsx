import React from 'react';
import classnames from 'classnames';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/root-store';
import RecentWorkspace from './recent-workspace';
import WorkspaceControl from './workspace-control';

type TRecentComponentProps = {
    is_explanation_expand: boolean;
    recent_strategies: any[];
    toggleExplanationExpand: boolean;
};

const RecentComponent = ({
    is_explanation_expand,
    recent_strategies,
    toggleExplanationExpand,
}: TRecentComponentProps) => {
    if (recent_strategies.length) {
        return (
            <div className='load-strategy__container load-strategy__container--has-footer'>
                <div className='load-strategy__recent'>
                    <div className='load-strategy__recent-files'>
                        <div className='load-strategy__title'>
                            <Localize i18n_default_text='Recent' />
                        </div>
                        <div className='load-strategy__recent-files-list'>
                            {recent_strategies.map(workspace => (
                                <RecentWorkspace key={workspace.id} workspace={workspace} />
                            ))}
                        </div>
                    </div>
                    <div className='load-strategy__recent-preview'>
                        <div className='load-strategy__title load-strategy__recent-preview-title'>
                            <Localize i18n_default_text='Preview' />
                        </div>
                        <div className='load-strategy__preview-workspace'>
                            <div id='load-strategy__blockly-container' style={{ height: '100%' }}>
                                <WorkspaceControl />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='load-strategy__container'>
            <div className='load-strategy__recent-empty'>
                <Icon icon='IcEmptyFolder' className='load-strategy__recent-empty-icon' size={128} />
                <div className='load-strategy__recent-empty-title'>
                    <Localize i18n_default_text='You do not have any recent bots' />
                </div>
                <div className='load-strategy__recent-empty-description'>
                    <Localize i18n_default_text='Create one or upload one from your local drive or Google Drive.' />
                </div>
                <div className='load-strategy__recent-empty-expand' onClick={toggleExplanationExpand}>
                    <Localize i18n_default_text="Why can't I see my recent bots?" />
                </div>
                <div
                    className={classnames('load-strategy__recent-empty-explanation', {
                        'load-strategy__recent-empty-explanation--show': is_explanation_expand,
                    })}
                >
                    <div>
                        <Localize i18n_default_text="If you've recently used bots but don't see them in this list, it may be because you:" />
                    </div>
                    <ol className='load-strategy__recent-empty-explanation-list'>
                        <li>
                            <Localize i18n_default_text='1. Logged in from a different device' />
                        </li>
                        <li>
                            <Localize i18n_default_text='2. Logged in from a different browser' />
                        </li>
                        <li>
                            <Localize i18n_default_text='3. Cleared your browser cache' />
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

const Recent = connect(({ load_modal }: RootStore) => ({
    is_explanation_expand: load_modal.is_explanation_expand,
    recent_strategies: load_modal.recent_strategies,
    toggleExplanationExpand: load_modal.toggleExplanationExpand,
}))(RecentComponent);

export default Recent;
