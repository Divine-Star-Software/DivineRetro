export const MatrixConstants = {
  IDENTITY_MATRIX: [
    1, 0, 0, 0, // Row 1
    0, 1, 0, 0, // Row 2
    0, 0, 1, 0, // Row 3
    0, 0, 0, 1, // Row 4
  ],
};

export class MatrixArray {
  static readonly MATRIX_INDEXES = {
    POSITION_X: 12,
    POSITION_Y: 13,
    POSITION_Z: 14,

    SCALE_X: 0,
    SCALE_Y: 5,
    SCALE_Z: 10,
  };

  trueIndex = 0;
  matrices: Float32Array;
  index: number = 0;

  constructor(sizeOrMatrix: number | MatrixArray, index: number = 0) {
    this.setMatricesIndex(index);

    if (sizeOrMatrix instanceof MatrixArray) {
      this.matrices = sizeOrMatrix.matrices;
    } else {
      this.matrices = new Float32Array(sizeOrMatrix * 16);
      for (let i = 0; i < sizeOrMatrix; i++) {
        this.setIdentityMatrix(i * 16);
      }
    }
  }

  private setIdentityMatrix(offset: number) {
    for (let i = 0; i < 16; i++) {
      this.matrices[offset + i] = MatrixConstants.IDENTITY_MATRIX[i % 16];
    }
  }

  setMatricesIndex(index: number) {
    this.index = index;
    this.trueIndex = index * 16;
    return this;
  }

  // Position getters and setters
  get positionX() {
    return this.matrices[this.trueIndex + MatrixArray.MATRIX_INDEXES.POSITION_X];
  }
  set positionX(value: number) {
    this.matrices[this.trueIndex + MatrixArray.MATRIX_INDEXES.POSITION_X] = value;
  }

  get positionY() {
    return this.matrices[this.trueIndex + MatrixArray.MATRIX_INDEXES.POSITION_Y];
  }
  set positionY(value: number) {
    this.matrices[this.trueIndex + MatrixArray.MATRIX_INDEXES.POSITION_Y] = value;
  }

  get positionZ() {
    return this.matrices[this.trueIndex + MatrixArray.MATRIX_INDEXES.POSITION_Z];
  }
  set positionZ(value: number) {
    this.matrices[this.trueIndex + MatrixArray.MATRIX_INDEXES.POSITION_Z] = value;
  }

  setPosition(x: number, y: number, z: number) {
    this.positionX = x;
    this.positionY = y;
    this.positionZ = z;
  }

  // Scale getters and setters
  get scaleX() {
    return this.matrices[this.trueIndex + MatrixArray.MATRIX_INDEXES.SCALE_X];
  }
  set scaleX(value: number) {
    this.matrices[this.trueIndex + MatrixArray.MATRIX_INDEXES.SCALE_X] = value;
  }

  get scaleY() {
    return this.matrices[this.trueIndex + MatrixArray.MATRIX_INDEXES.SCALE_Y];
  }
  set scaleY(value: number) {
    this.matrices[this.trueIndex + MatrixArray.MATRIX_INDEXES.SCALE_Y] = value;
  }

  get scaleZ() {
    return this.matrices[this.trueIndex + MatrixArray.MATRIX_INDEXES.SCALE_Z];
  }
  set scaleZ(value: number) {
    this.matrices[this.trueIndex + MatrixArray.MATRIX_INDEXES.SCALE_Z] = value;
  }

  setScale(x: number, y: number, z: number) {
    this.scaleX = x;
    this.scaleY = y;
    this.scaleZ = z;
  }

  copy(matrix: MatrixArray) {
    for (let i = 0; i < 16; i++) {
      this.matrices[this.trueIndex + i] = matrix.matrices[matrix.trueIndex + i];
    }
  }

  multiply(matrix: MatrixArray) {
    const result = new Float32Array(16);
    const a = this.matrices.subarray(this.trueIndex, this.trueIndex + 16);
    const b = matrix.matrices.subarray(matrix.trueIndex, matrix.trueIndex + 16);

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        result[row * 4 + col] =
          a[row * 4 + 0] * b[col + 0] +
          a[row * 4 + 1] * b[col + 4] +
          a[row * 4 + 2] * b[col + 8] +
          a[row * 4 + 3] * b[col + 12];
      }
    }

    // Update the current matrix with the result
    for (let i = 0; i < 16; i++) {
      this.matrices[this.trueIndex + i] = result[i];
    }
  }

  // Optional: Method to get a copy of the current matrix values
  getMatrixValues() {
    return this.matrices.slice(this.trueIndex, this.trueIndex + 16);
  }
}

// Usage example
const matrix = new MatrixArray(1);
matrix.setPosition(10, 20, 30);
matrix.setScale(2, 2, 2);

console.log('Position:', matrix.positionX, matrix.positionY, matrix.positionZ);
console.log('Scale:', matrix.scaleX, matrix.scaleY, matrix.scaleZ);
