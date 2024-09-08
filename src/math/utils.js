// Math constants
export const TAU = 6.28318530718;

// Helper functions
/**
 * @brief Restricts the given value between the minimum and maximum bound
 *
 * @param {Number} min - Minimum bound
 * @param {Number} max - Maximum bound
 * @param {Number} val - Value to test
 *
 * @returns Appropriate number between minimum bound and the maximum bound
 */
export const clamp = (min, max, val) => val < min ? min : val > max ? max : val;

/**
 * @brief Determines the smallest of two values
 *
 * @param {Number} val1 - Value to test against
 * @param {Number} val2 - Value to test against
 *
 * @returns The smallest of the two provided values
 */
export const min = (val1, val2) => val1 < val2 ? val1 : val2;

/**
 * @brief Determines the largest of two values
 *
 * @param {Number} val1 - Value to test against
 * @param {Number} val2 - Value to test against
 *
 * @returns The largest of the two provided values
 */
export const max = (val1, val2) => val1 > val2 ? val1 : val2;

/**
 * @brief Eases a transition between two values over time
 *
 * @param {Number} curr - Current value
 * @param {Number} dst  - Final number to reach
 * @param {Number} time - Time to transition
 *
 * @returns Eased value
 */
export const lerp = (curr, dst, time) => curr * (1 - time) + dst * time;

/**
 * @brief Get a random floating-point number in the range of the lower and higher bound
 *
 * @param {Number} min - Lower-bound
 * @param {Number} max - Higher-bound
 *
 * @returns Random number in the range of the lower and higher bound
 */
export const rand = (min, max) => Math.random() * (max - min + 1) + min;

/**
 * @brief Get a random integer number in the range of the lower and higher bound
 *
 * @param {Number} min - Lower-bound
 * @param {Number} max - Higher-bound
 *
 * @returns Random number in the range of the lower and higher bound
 */
export const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
