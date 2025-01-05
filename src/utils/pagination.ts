import { FindAndCountOptions } from 'sequelize';

/**
 * Calculate pagination parameters based on query inputs.
 * @param {number} page - The current page number.
 * @param {number} size - The number of items per page.
 * @returns {object} - Offset and limit for Sequelize queries.
 */
export function getPagination(page: number, size: number) {
  const limit = size > 0 ? size : 10;
  const offset = page > 0 ? (page - 1) * limit : 0;
  return { limit, offset };
}

/**
 * Format the paginated response.
 * @param {number} count - Total number of records.
 * @param {number} page - Current page number.
 * @param {number} limit - Number of items per page.
 * @param {Array} rows - The fetched data.
 * @returns {object} - Formatted paginated response.
 */
export function getPagingData<T>(
  data: { count: number; rows: T[] },
  page: number,
  limit: number
) {
  const { count: totalItems, rows } = data;
  const currentPage = page;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    items: rows,
    totalPages,
    currentPage,
  };
}

/**
 * Create options for Sequelize's findAndCountAll method.
 * @param {number} page - The current page number.
 * @param {number} size - The number of items per page.
 * @param {FindAndCountOptions} additionalOptions - Additional Sequelize options.
 * @returns {FindAndCountOptions} - The complete options object.
 */
export function createPaginationOptions(
  page: number,
  size: number,
  additionalOptions: FindAndCountOptions = {}
) {
  const { limit, offset } = getPagination(page, size);
  return {
    ...additionalOptions,
    limit,
    offset,
  };
}
