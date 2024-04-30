import React from 'react';
import classnames from 'classnames';
import { Icon } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import RecentWorkspace from './recent-workspace';
import WorkspaceControl from './workspace-control';

const RecentComponent = observer(() => {
    const { load_modal } = useDBotStore();
    const { is_explanation_expand, recent_strategies, toggleExplanationExpand } = load_modal;
    if (recent_strategies.length) {
        return (
            <div className='load-strategy__container load-strategy__container--has-footer'>
                <div className='load-strategy__recent'>
                    <div className='load-strategy__recent__files'>
                        {recent_strategies.map(workspace => (
                            <RecentWorkspace key={workspace.id} workspace={workspace} />
                        ))}
                    </div>
                    <div className='load-strategy__recent__preview'>
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
            <div className='load-strategy__recent__empty' data-testid='dt-load-strategy__recent__empty'>
                <Icon icon='IcEmptyFolder' className='load-strategy__recent__empty-icon' size={128} />
                <div className='load-strategy__recent__empty-title'>
                    <Localize i18n_default_text='You do not have any recent bots' />
                </div>
                <div className='load-strategy__recent__empty-description'>
                    <Localize i18n_default_text='Create one or upload one from your local drive or Google Drive.' />
                </div>
                <div
                    tabIndex={0}
                    className='load-strategy__recent__empty-expand'
                    data-testid='dt-load-strategy__recent__empty-expand'
                    onClick={toggleExplanationExpand}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter') toggleExplanationExpand();
                    }}
                >
                    <Localize i18n_default_text="Why can't I see my recent bots?" />
                </div>
                <div
                    data-testid={
                        is_explanation_expand ? 'dt-empty-explanation-list--open' : 'dt-empty-explanation-list--close'
                    }
                    className={classnames('load-strategy__recent__empty-explanation', {
                        'load-strategy__recent__empty-explanation--show': is_explanation_expand,
                    })}
                >
                    <div>
                        <Localize i18n_default_text="If you've recently used bots but don't see them in this list, it may be because you:" />
                    </div>
                    <ol className='load-strategy__recent__empty-explanation-list'>
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
});

export default RecentComponent;
