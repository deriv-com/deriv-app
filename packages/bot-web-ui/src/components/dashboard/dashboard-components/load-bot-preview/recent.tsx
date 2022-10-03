import classnames from 'classnames';
import React from 'react';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RecentWorkspace from './recent-workspace';
import RootStore from 'Stores/index';

type TRecentComponent = {
    is_explanation_expand: boolean;
    recent_strategies: [];
    toggleExplanationExpand: boolean;
    handleFileChange: () => void;
    onEntered: () => void;
    toggleStrategies: (param: boolean) => void;
};

const RecentComponent = ({
    is_explanation_expand,
    recent_strategies,
    toggleExplanationExpand,
    handleFileChange,
    toggleStrategies,
    onEntered,
}: TRecentComponent) => {
    React.useEffect(() => {
        toggleStrategies(true);
    }, []);

    if (recent_strategies.length) {
        return (
            <div className='load-strategy__container load-strategy__container--has-footer'>
                <div className='load-strategy__recent'>
                    <div className='load-strategy__recent-files'>
                        <div className='load-strategy__title'>
                            <Localize i18n_default_text='Your Bots' />
                        </div>
                        <div className='load-strategy__recent-files-list'>
                            {recent_strategies.map((workspace, index) => (
                                <RecentWorkspace key={workspace.id} workspace={workspace} index={index} />
                            ))}
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
    handleFileChange: load_modal.handleFileChange,
    toggleExplanationExpand: load_modal.toggleExplanationExpand,
    onEntered: load_modal.onEntered,
    load_recent_strategies: load_modal.load_recent_strategies,
    toggleStrategies: load_modal.toggleStrategies,
}))(RecentComponent);

export default Recent;
