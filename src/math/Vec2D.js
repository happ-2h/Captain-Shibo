export default class Vec2D {
  #x;
  #y;

  constructor(x=0, y=0) {
    this.#x = x;
    this.#y = y;
  }

  // Directional vectors
  /**
   * @returns Empty vector
   */
  static zero()  { return new Vec2D(0, 0);  }

  /**
   * @returns Left-directional vector
   */
  static left()  { return new Vec2D(-1, 0); }

  /**
   * @returns Right-directional vector
   */
  static right() { return new Vec2D(1, 0);  }

  /**
   * @returns Up-directional vector
   */
  static up()    { return new Vec2D(0, -1); }

  /**
   * @returns Down-directional vector
   */
  static down()  { return new Vec2D(0, 1);  }

  // Mathematical functions
  /**
   * @brief Performs vector addition on the provided vectors
   *
   * @param {Vec2D} v1 - Vector as addend
   * @param {Vec2D} v2 - Vector as addend
   *
   * @returns New vector with summed properties
   */
  static add(v1, v2) {
    return new Vec2D(v1.x + v2.x, v1.y + v2.y);
  }

  /**
   * @brief Performs vector subtraction on the provided vectors
   *
   * @param {Vec2D} v1 - Vector as minuend
   * @param {Vec2D} v2 - Vector as subtrahend
   *
   * @returns New vector with the difference of the properties
   */
  static sub(v1, v2) {
    return new Vec2D(v1.x - v2.x, v1.y - v2.y);
  }

  /**
   * @brief Multiplies vector properties together
   *
   * @param {Vec2D} v1 - Vector as a factor
   * @param {Vec2D} v2 - Vector as a factor
   *
   * @returns New vector with the product of the properties
   */
  static mul(v1, v2) {
    return new Vec2D(v1.x * v2.x, v1.y * v2.y);
  }

  /**
   * @brief Scales a vector by the given scalar
   *
   * @param {Vec2D} v1     - Vector to scale
   * @param {Vec2D} scalar - Scalar
   *
   * @returns New vector with scaled properties
   */
  static scale(v1, scalar) {
    return new Vec2D(v1.x * scalar, v1.y * scalar);
  }

  /**
   * @brief Calculates the dot product of two vectors
   *
   * @param {Vec2D} v1 - Vector used to calculate the dot product
   * @param {Vec2D} v2 - Vector used to calculate the dot product
   *
   * @returns The dot product
   */
  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  /**
   * @brief Calculates the 2D cross product of two vectors
   *
   * @param {Vec2D} v1 - Vector used to calculate the 2D cross product
   * @param {Vec2D} v2 - Vector used to calculate the 2D cross product
   *
   * @returns The cross product
   */
  static cross(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
  }

  /**
   * @brief Normalized form of the given vector
   *
   * @param {Vec2D} v1 - Vector to use for normalizing
   *
   * @returns New normalized vector
   */
  static normalize(v1) {
    const len = v1.length;

    if (len === 0) return Vec2D.zero();

    return new Vec2D(v1.x/len, v2.y/len);
  }

  /**
   * @brief Rotates a vector
   *
   * @param {Vec2D}  v1  - Vector used to get rotation
   * @param {Number} ang - Angle, in radians, to rotate the vector
   *
   * @returns New rotated vector
   */
  static rotate(v1, ang) {
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);

    return new Vec2D(
      cos * v1.x - sin * v1.y,
      sin * v1.x + cos * v1.y
    );
  }

  // Utils
  /**
   * @brief Get a vector from the given angle
   *
   * @param {Vec2D} ang - Angle in radians
   *
   * @returns New vector
   */
  static angToVec(ang) {
    return new Vec2D(Math.cos(ang), Math.sin(ang));
  }

  /**
   * @brief Get an angle from the given vector
   *
   * @param {Vec2D} vec - Vector to get the angle from
   *
   * @returns Angle in radians
   */
  static vecToAng(vec) {
    if (vec.x === 0 && vec.y === 0) return Vec2D.zero();

    return Math.atan2(vec.y, vec.x);
  }

  /**
   * @brief Get the angle between two vectors
   *
   * @param {Number} v1 - Vector to use for calculating the angle
   * @param {Number} v2 - Vector to use for calculating the angle
   *
   * @returns Angle, in radians, between the two vectors
   */
  static angBetween(v1, v2) {
    const l1 = v1.length;
    const l2 = v2.length;

    if (l1 === 0 || l2 === 0) return 0;

    return Math.acos(Vec2D.dot(v1, v2) / (l1 * l2));
  }

  // Mutable operations
  /**
   * @brief Performs vector addition with the provided vector
   *
   * @param {Vec2D} vec - Vector as addend
   */
  add(vec) {
    this.#x += vec.x;
    this.#y += vec.y;
  }

  /**
   * @brief Performs vector subtraction with the provided vector
   *
   * @param {Vec2D} vec - Vector as subtrahend
   */
  sub(vec) {
    this.#x -= vec.x;
    this.#y -= vec.y;
  }

  /**
   * @brief Multiplies the vector by the provided vector
   *
   * @param {Vec2D} vec - Vector as factor
   */
  mul(vec) {
    this.#x *= vec.x;
    this.#y *= vec.y;
  }

  /**
   * @brief Scales the vector by the provided scalar
   *
   * @param {Vec2D} scalar - Value to scale the vector by
   */
  scale(scalar) {
    this.#x *= scalar;
    this.#y *= scalar;
  }

  /**
   * @brief Calculates the dot product\
   *        The calculation uses the normalized version of this vector
   *
   * @param {Vec2D} vec - Vector to use to calculate the dot product
   *
   * @returns The dot product
   */
  dot(vec) {
    const nrm = Vec2D.normalize(this);

    return nrm.x * vec.x + nrm.y * vec.y;
  }

  /**
   * @brief Calculates the 2D cross product of two vectors
   *
   * @param {Vec2D} vec - Vector used to calculate the 2D cross product
   *
   * @returns The cross product
   */
  cross(vec) {
    return this.#x * vec.y - this.#y * vec.x;
  }

  /**
   * @brief Normalizes the vector
   */
  normalize() {
    const len = this.length;

    if (len === 0) return;

    this.#x /= len;
    this.#y /= len;
  }

  /**
   * @brief Rotates a vector
   *
   * @param {Number} ang - Angle, in radians, to rotate the vector
   */
  rotate(ang) {
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);

    const tmpx = this.#x;
    const tmpy = this.#y;

    this.#x = cos * tmpx - sin * tmpy;
    this.#y = sin * tmpx + cos * tmpy;
  }

  /**
   * @brief Returns the distance between this vector and the provided vector
   *
   * @param {Vec2D} vec - Destination vector
   */
  dist(vec) {
    const sub = Vec2D.sub(this, vec);

    return sub.length;
  }

  /**
   * @brief Calculates the magnitude of the vector
   *
   * @returns Magnitude of the vector
   */
  magnitude() {
    return this.length;
  }

  /**
   * @brief Get one unit of this vector
   *
   * @returns New vector representing one unit of this vector
   */
  unit() {
    return Vec2D.normalize(this);
  }

  // Utils
  /**
   * @brief Prints properties to the console as (x, y)
   */
  print() {
    console.log(`(${this.#x}, ${this.#y})`);
  }

  /**
   * @brief Determines if this vector's parameters
   *        match the given vector's parameters
   *
   * @param {Vec2D} vec - Vector to check against
   *
   * @returns true if parameters are equal; false otherwise
   */
  equals(vec) {
    return (this.#x === vec.x && this.#y === vec.y);
  }

  /**
   * @brief Copies the properties of the given vector
   *
   * @param {Vec2D} vec - Vector to copy
   */
  copy(vec) {
    this.#x = vec.x;
    this.#y = vec.y;
  }

  /**
   * @brief Sets both x and y properties of the vector
   *
   * @param {Number} x - New x-property
   * @param {Number} y - New y-property
   */
  set(x, y) {
    this.#x = x;
    this.#y = y;
  }

  /**
   * @brief Sets the vector's properties to zero
   */
  reset() {
    this.#x = 0;
    this.#y = 0;
  }

  /**
   * @brief Creates a new vector with the same properties
   *
   * @returns New vector with the same properties of this one
   */
  clone() {
    return new Vec2D(this.#x, this.#y);
  }

  /**
   * @brief Calculates the magnitude of the vector
   *
   * @returns Magnitude of the vector
   */
  get length() {
    return Math.sqrt(this.#x * this.#x + this.#y * this.#y);
  }

  // Mutators
  set x(x) { this.#x = x; }
  set y(y) { this.#y = y; }

  // Accessors
  get x() { return this.#x; }
  get y() { return this.#y; }
};
