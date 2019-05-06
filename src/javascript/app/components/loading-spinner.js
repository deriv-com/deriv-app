const assertContainerExists = (content_id) => {
    if (!content_id) {
        throw new Error('Loading spinner content id is missing or undefined.');
    }
};
/**
 * Accepts a DOM element ID and renders loading spinner inside of it.
 *
 * @param content_id
 */
export const show = (content_id) => {
    assertContainerExists(content_id);
    const $container = $(`#${content_id}`);
    $container
        .append($('<div />', { class: 'barspinner dark' })
            .append($('<div />', { class: 'rect1' }))
            .append($('<div />', { class: 'rect2' }))
            .append($('<div />', { class: 'rect3' }))
            .append($('<div />', { class: 'rect4' }))
            .append($('<div />', { class: 'rect5' })));
};

/**
 * Remove Loading spinner inside the container, does nothing if there is no spinner loading.
 *
 * @param content_id
 */
export const hide = (content_id) => {
    assertContainerExists(content_id);
    const $container = $(`#${content_id}`);
    const $spinner   = $container.find('.barspinner');
    if ($spinner) {
        $spinner.remove();
    }
};

export default {
    showLoadingSpinner: show,
    hideLoadingSpinner: hide,
};
