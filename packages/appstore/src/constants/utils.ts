import { isMobile } from '@deriv/shared';

/**
 * This function checks whether the current item should have a border at the bottom 'aka "divider" '.
 * @function getHasDivider
 * @param { number } current_item_index // the index of the current list item
 * @param { number } list_size // size of the whole list
 * @param { number } offset // This is used to determine how many items should be left with out a border at the end of the list
 * @param { number } available_grid_columns // how many css grid columns the container element has or provides
 * @return { boolean }
 * */
export const getHasDivider = (
    current_item_index: number,
    list_size: number,
    offset: number,
    available_grid_columns: number
) =>
    isMobile()
        ? current_item_index <
          list_size -
              ((list_size + offset) % available_grid_columns === 0
                  ? offset
                  : (list_size + offset) % available_grid_columns)
        : current_item_index <
          list_size -
              (list_size % available_grid_columns === 0 ? available_grid_columns : list_size % available_grid_columns);
