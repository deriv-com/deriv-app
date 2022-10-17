import React from 'react';
import { Icon, Dialog, Text } from '@deriv/components';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { localize } from '@deriv/translations';
import classNames from 'classnames';

type TGuideContent = {
    dialog_options: { [key: string]: string };
    faq_search_value: string;
    is_dialog_open: boolean;
    onOkButtonClick: () => void;
    showVideoDialog: (url: string) => void;
    guide_list: [];
};

const GuideContent = ({
    dialog_options,
    faq_search_value,
    is_dialog_open,
    onOkButtonClick,
    showVideoDialog,
    guide_list,
}: TGuideContent) => {
    return (
        <div className='tutorials-wrap'>
            <Text align='center' weight='bold' color='prominent' line_height='s'>
                Guides
            </Text>
            <div className='tutorials-wrap__group'>
                {guide_list?.length ? (
                    guide_list.map(({ id, content, url }) => {
                        return (
                            <div className='tutorials-wrap__group__cards' key={id}>
                                <div
                                    className={classNames('tutorials-wrap__placeholder', {
                                        'tutorials-wrap__placeholder--disabled': !url,
                                    })}
                                >
                                    <div className='tutorials-wrap__placeholder__button-group'>
                                        <Icon
                                            className='tutorials-wrap__placeholder__button-group--play'
                                            width='4rem'
                                            height='4rem'
                                            icon={'IcPlayOutline'}
                                            onClick={() => showVideoDialog(url)}
                                        />
                                    </div>
                                </div>
                                <Text align='center' color='prominent' line_height='s' size='s'>
                                    {content}
                                </Text>
                            </div>
                        );
                    })
                ) : (
                    <Text as='h1' weight='bold' line_height='xxs'>
                        {localize('No results found "{{ faq_search_value }}"', {
                            faq_search_value,
                        })}
                    </Text>
                )}
                <Dialog
                    title={dialog_options.title}
                    is_visible={is_dialog_open}
                    cancel_button_text={localize('Cancel')}
                    onCancel={onOkButtonClick}
                    confirm_button_text={localize('OK')}
                    onConfirm={onOkButtonClick}
                    is_mobile_full_width
                    className={'dc-dialog dc-dialog__wrapper-guide--fixed'}
                    has_close_icon
                    onClose={onOkButtonClick}
                >
                    <iframe width='100%' height='100%' src={dialog_options.url} frameBorder='0' allowFullScreen />
                </Dialog>
            </div>
        </div>
    );
};

export default connect(({ dashboard, load_modal }: RootStore) => ({
    faq_search_value: dashboard.faq_search_value,
    is_dialog_open: dashboard.is_dialog_open,
    onOkButtonClick: dashboard.onCloseDialog,
    showVideoDialog: dashboard.showVideoDialog,
    dialog_options: dashboard.dialog_options,
    toggleLoadModal: load_modal.toggleLoadModal,
}))(GuideContent);
