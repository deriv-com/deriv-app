import React from 'react';
import { Icon, Dialog } from '@deriv/components';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { localize } from '@deriv/translations';

type TcontentArray = {
    id: number;
    type: string;
    content: string;
    url?: string;
};

const contentArray: TcontentArray[] = [
    {
        id: 1,
        type: 'DBotVideo',
        content: 'DBot -- your automated trading partner',
        url: 'https://www.youtube.com/watch?v=tvBiEIq3G7k',
    },
    {
        id: 2,
        type: 'DBotTour',
        content: 'How to build your bot from scratch using a simple strategy.',
    },
];

type TGuideContent = {
    faq_search_value: string;
    is_dialog_open: boolean;
    is_running: boolean;
    closeResetDialog: () => void;
    onOkButtonClick: () => void;
    showVideoDialog: (type: string, url?: string) => void;
    dialog_options: { [key: string]: string };
};

const GuideContent = ({
    faq_search_value,
    is_dialog_open,
    onOkButtonClick,
    closeResetDialog,
    showVideoDialog,
    dialog_options,
}: TGuideContent) => {
    let finalContentArray = contentArray;
    React.useEffect(() => {
        if (faq_search_value) {
            finalContentArray = contentArray.filter(data => {
                return data.content.toLowerCase().includes(faq_search_value);
            });
        }
    }, [faq_search_value]);

    return (
        <div className='dc-tabs__inner-content'>
            <h1 className='dc-tabs__inner-content--heading'>Guides</h1>
            <div className='dc-tabs__inner-content--card'>
                {finalContentArray.map(items => {
                    const { id, content, type, url } = items;
                    return (
                        <div className='dc-tabs__inner-content--card-holder' key={id}>
                            <div className='dc-tabs__inner-content--card-holder-placeholder'>
                                <div className='dc-tabs__inner-content--card-holder-placeholder--button-group'>
                                    <Icon
                                        className='dc-tabs__inner-content--card-holder-placeholder--button-group-play'
                                        width='4rem'
                                        height='4rem'
                                        icon={'IcPlayOutline'}
                                        onClick={() => {
                                            showVideoDialog(type, url);
                                        }}
                                    />
                                </div>
                            </div>
                            <span className='dc-tabs__inner-content--card-holder-label'>{content}</span>
                        </div>
                    );
                })}
                <Dialog
                    title={dialog_options.title}
                    is_visible={is_dialog_open}
                    cancel_button_text={localize('Cancel')}
                    onCancel={closeResetDialog}
                    confirm_button_text={localize('OK')}
                    onConfirm={onOkButtonClick || onOkButtonClick}
                    is_mobile_full_width
                    className={'dc-dialog__wrapper--fixed'}
                    has_close_icon
                    onClose={onOkButtonClick}
                >
                    {dialog_options.message}
                </Dialog>
            </div>
        </div>
    );
};

export default connect(({ dashbaord, load_modal }: RootStore) => ({
    faq_search_value: dashbaord.faq_search_value,
    is_dialog_open: dashbaord.is_dialog_open,
    onOkButtonClick: dashbaord.onCloseDialog,
    closeResetDialog: dashbaord.onCloseDialog,
    showVideoDialog: dashbaord.showVideoDialog,
    dialog_options: dashbaord.dialog_options,
    toggleLoadModal: load_modal.toggleLoadModal,
}))(GuideContent);
