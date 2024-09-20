import Circle from "../utils/Circle";

let instance = null;

class _CollisionChecker {
  constructor() {
    if (instance) throw new Error("CollisionChecker singleton reconstructed");
    instance = this;
  }

  /**
   * @brief Circle-circle collision check
   *
   * @param {Circle} c1 - First circle to check
   * @param {Circle} c2 - Second circle to check
   * @returns true if the circles intersect; false otherwise
   */
  circle_circle(c1, c2) {
    const rads = c1.radius + c2.radius;
    const _x = c2.x - c1.x;
    const _y = c2.y - c1.y;

    return (rads * rads) > (_x * _x) + (_y * _y);
  }
};

const CollisionChecker = new _CollisionChecker;
export default CollisionChecker;