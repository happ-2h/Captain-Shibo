/**
 * @brief Converts the current canvas state to a png
 *
 * @returns Current canvas state as a png
 */
export const canvasSnapshot = () => document.querySelector("canvas").toDataURL("image/png");