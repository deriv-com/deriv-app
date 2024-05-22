import React from 'react';
// import { Analytics } from '@deriv-com/analytics';
// import { SessionStore } from '@deriv/shared';
import { getAllowedLanguages, Localize } from '@deriv/translations';
import { DerivLightIntuitivePlatformsIcon } from '@deriv/quill-icons';
import { TEbooksUrl } from 'Components/banners/book-banner/book-banner';
import { Modal, Text, Heading, ThemeProvider } from '@deriv-com/quill-ui';
import { useStore } from '@deriv/stores';

type TBookBannerTemplate = {
    e_book_show_way?: string;
    e_books_url?: TEbooksUrl;
    e_book_from_landing?: keyof TEbooksUrl;
    lang?: ReturnType<typeof getAllowedLanguages>;
};

const BookModalTemplate = ({ e_book_show_way, e_books_url, e_book_from_landing, lang }: TBookBannerTemplate) => {
    const [is_modal_shows, setIsPopUpShows] = React.useState(true);
    const { traders_hub, ui } = useStore();
    const { is_mobile } = ui;
    const { selected_account_type } = traders_hub;

    // const analytics_data: Parameters<typeof Analytics.trackEvent>[1] = {
    //     modal_name: e_book_from_landing,
    //     account_mode: selected_account_type,
    // };

    // React.useEffect(() => {
    //     Analytics.trackEvent('ce_tradershub_banner', {
    //         action: 'open',
    //         ...analytics_data,
    //     });
    // }, []);
    const downloadBook = () => {
        const book = e_books_url[e_book_from_landing];
        return window.open(book[lang] || book.EN);
    };

    return (
        <ThemeProvider theme='light'>
            <React.Fragment>
                <div id='e-book-banner'>
                    <div>
                        <Modal
                            isOpened={is_modal_shows}
                            showHandleBar
                            isMobile={is_mobile}
                            showCrossIcon
                            disableCloseOnOverlay
                            hasFooter={e_book_show_way === 'popup-with-link'}
                            toggleModal={() => setIsPopUpShows(false)}
                            showPrimaryButton={e_book_show_way === 'popup-with-link'}
                            primaryButtonCallback={downloadBook}
                            primaryButtonLabel={<Localize i18n_default_text='Download e-book' />}
                        >
                            <Modal.Header image={<DerivLightIntuitivePlatformsIcon height='120px' width='120px' />} />
                            <Modal.Body>
                                <Heading.H4>
                                    <Localize i18n_default_text='Your e-book is ready to download' />
                                </Heading.H4>
                                <Text>
                                    <Localize i18n_default_text='We’ve sent your e-book to your email. You can also download it here.' />
                                </Text>
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>
            </React.Fragment>
        </ThemeProvider>
    );
};

export default BookModalTemplate;
