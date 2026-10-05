/**
 * Array Address Calculator Module
 * Provides address calculation formulas for 1D and 2D arrays (RMO & CMO)
 * with step-by-step arithmetic breakdowns.
 */

class ArrayCalculator {
  /**
   * Parse hex or decimal base address string into an integer.
   * @param {string|number} baseInput 
   * @returns {number}
   */
  static parseBaseAddress(baseInput) {
    if (typeof baseInput === 'number') return baseInput;
    const str = String(baseInput).trim();
    if (str.toLowerCase().startsWith('0x')) {
      return parseInt(str, 16) || 1000;
    }
    return parseInt(str, 10) || 1000;
  }

  /**
   * Format integer address into uppercase Hexadecimal format with '0x' prefix
   * @param {number} address 
   * @param {number} padDigits 
   * @returns {string}
   */
  static formatHex(address, padDigits = 4) {
    if (isNaN(address)) return '0x0000';
    return '0x' + Math.max(0, address).toString(16).toUpperCase().padStart(padDigits, '0');
  }

  /**
   * Calculate 1D Array Element Address with step-by-step breakdown
   * Formula: Address(A[i]) = Base + (i - LB) * W
   */
  static calculate1D({ baseAddress, elementSize, targetIndex, lowerBound = 0 }) {
    const B = this.parseBaseAddress(baseAddress);
    const W = Number(elementSize) || 4;
    const i = Number(targetIndex) || 0;
    const LB = Number(lowerBound) || 0;

    const relativeIndex = i - LB;
    const byteOffset = relativeIndex * W;
    const finalAddress = B + byteOffset;

    return {
      dimension: '1D',
      baseAddress: B,
      baseAddressHex: this.formatHex(B),
      elementSize: W,
      targetIndex: i,
      lowerBound: LB,
      relativeIndex,
      byteOffset,
      finalAddress,
      finalAddressHex: this.formatHex(finalAddress),
      formulaRaw: 'Address(A[i]) = Base + (i - LB) × W',
      steps: [
        {
          title: 'Step 1: Identify Parameters',
          description: `Base Address (Base) = ${B} (${this.formatHex(B)}), Element Size (W) = ${W} bytes, Target Index (i) = ${i}, Lower Bound (LB) = ${LB}`
        },
        {
          title: 'Step 2: Calculate Relative Index Offset',
          description: `Index Offset = (i - LB) = (${i} - ${LB}) = ${relativeIndex} elements`
        },
        {
          title: 'Step 3: Calculate Memory Byte Offset',
          description: `Byte Offset = Offset × W = ${relativeIndex} × ${W} = ${byteOffset} bytes`
        },
        {
          title: 'Step 4: Add Byte Offset to Base Address',
          description: `Final Address = Base + Byte Offset = ${B} + ${byteOffset} = ${finalAddress} (Decimal) = ${this.formatHex(finalAddress)} (Hex)`
        }
      ]
    };
  }

  /**
   * Calculate 2D Array Element Address with Row-Major Order (RMO)
   * Formula: Address(A[i][j]) = Base + [(i - LBR) × C + (j - LBC)] × W
   */
  static calculate2DRMO({ baseAddress, elementSize, totalRows, totalCols, targetRow, targetCol, lowerBoundRow = 0, lowerBoundCol = 0 }) {
    const B = this.parseBaseAddress(baseAddress);
    const W = Number(elementSize) || 4;
    const R = Number(totalRows) || 4;
    const C = Number(totalCols) || 4;
    const i = Number(targetRow) || 0;
    const j = Number(targetCol) || 0;
    const LBR = Number(lowerBoundRow) || 0;
    const LBC = Number(lowerBoundCol) || 0;

    const rowOffset = i - LBR;
    const colOffset = j - LBC;

    const elementsInPrecedingRows = rowOffset * C;
    const totalElementOffset = elementsInPrecedingRows + colOffset;
    const byteOffset = totalElementOffset * W;
    const finalAddress = B + byteOffset;

    return {
      dimension: '2D',
      ordering: 'RMO',
      baseAddress: B,
      baseAddressHex: this.formatHex(B),
      elementSize: W,
      totalRows: R,
      totalCols: C,
      targetRow: i,
      targetCol: j,
      lowerBoundRow: LBR,
      lowerBoundCol: LBC,
      rowOffset,
      colOffset,
      elementsInPrecedingRows,
      totalElementOffset,
      byteOffset,
      finalAddress,
      finalAddressHex: this.formatHex(finalAddress),
      formulaRaw: 'Address(A[i][j]) = Base + [ (i - LBR) × C + (j - LBC) ] × W',
      steps: [
        {
          title: 'Step 1: Identify Parameters',
          description: `Base Address = ${B} (${this.formatHex(B)}), Element Size W = ${W}B, Rows R = ${R}, Cols C = ${C}, Target = A[${i}][${j}], LBR = ${LBR}, LBC = ${LBC}`
        },
        {
          title: 'Step 2: Calculate Row Offset (Preceding Rows)',
          description: `Preceding Rows = (i - LBR) = (${i} - ${LBR}) = ${rowOffset} full row(s). Elements in preceding rows = ${rowOffset} × ${C} = ${elementsInPrecedingRows} elements`
        },
        {
          title: 'Step 3: Add Column Offset (Preceding Elements in Target Row)',
          description: `Preceding Columns = (j - LBC) = (${j} - ${LBC}) = ${colOffset} element(s). Total Element Index = ${elementsInPrecedingRows} + ${colOffset} = ${totalElementOffset} elements`
        },
        {
          title: 'Step 4: Compute Byte Offset',
          description: `Byte Offset = Total Element Index × W = ${totalElementOffset} × ${W} = ${byteOffset} bytes`
        },
        {
          title: 'Step 5: Compute Final Address',
          description: `Final Address = Base + Byte Offset = ${B} + ${byteOffset} = ${finalAddress} (Decimal) = ${this.formatHex(finalAddress)} (Hex)`
        }
      ]
    };
  }

  /**
   * Calculate 2D Array Element Address with Column-Major Order (CMO)
   * Formula: Address(A[i][j]) = Base + [(j - LBC) × R + (i - LBR)] × W
   */
  static calculate2DCMO({ baseAddress, elementSize, totalRows, totalCols, targetRow, targetCol, lowerBoundRow = 0, lowerBoundCol = 0 }) {
    const B = this.parseBaseAddress(baseAddress);
    const W = Number(elementSize) || 4;
    const R = Number(totalRows) || 4;
    const C = Number(totalCols) || 4;
    const i = Number(targetRow) || 0;
    const j = Number(targetCol) || 0;
    const LBR = Number(lowerBoundRow) || 0;
    const LBC = Number(lowerBoundCol) || 0;

    const rowOffset = i - LBR;
    const colOffset = j - LBC;

    const elementsInPrecedingCols = colOffset * R;
    const totalElementOffset = elementsInPrecedingCols + rowOffset;
    const byteOffset = totalElementOffset * W;
    const finalAddress = B + byteOffset;

    return {
      dimension: '2D',
      ordering: 'CMO',
      baseAddress: B,
      baseAddressHex: this.formatHex(B),
      elementSize: W,
      totalRows: R,
      totalCols: C,
      targetRow: i,
      targetCol: j,
      lowerBoundRow: LBR,
      lowerBoundCol: LBC,
      rowOffset,
      colOffset,
      elementsInPrecedingCols,
      totalElementOffset,
      byteOffset,
      finalAddress,
      finalAddressHex: this.formatHex(finalAddress),
      formulaRaw: 'Address(A[i][j]) = Base + [ (j - LBC) × R + (i - LBR) ] × W',
      steps: [
        {
          title: 'Step 1: Identify Parameters',
          description: `Base Address = ${B} (${this.formatHex(B)}), Element Size W = ${W}B, Rows R = ${R}, Cols C = ${C}, Target = A[${i}][${j}], LBR = ${LBR}, LBC = ${LBC}`
        },
        {
          title: 'Step 2: Calculate Column Offset (Preceding Columns)',
          description: `Preceding Columns = (j - LBC) = (${j} - ${LBC}) = ${colOffset} full column(s). Elements in preceding columns = ${colOffset} × ${R} = ${elementsInPrecedingCols} elements`
        },
        {
          title: 'Step 3: Add Row Offset (Preceding Elements in Target Column)',
          description: `Preceding Rows = (i - LBR) = (${i} - ${LBR}) = ${rowOffset} element(s). Total Element Index = ${elementsInPrecedingCols} + ${rowOffset} = ${totalElementOffset} elements`
        },
        {
          title: 'Step 4: Compute Byte Offset',
          description: `Byte Offset = Total Element Index × W = ${totalElementOffset} × ${W} = ${byteOffset} bytes`
        },
        {
          title: 'Step 5: Compute Final Address',
          description: `Final Address = Base + Byte Offset = ${B} + ${byteOffset} = ${finalAddress} (Decimal) = ${this.formatHex(finalAddress)} (Hex)`
        }
      ]
    };
  }

  /**
   * Helper method to compute address for any 1D/2D cell directly
   */
  static getCellAddress(config, r, c = 0) {
    if (config.dimension === '1D') {
      return this.calculate1D({
        baseAddress: config.baseAddress,
        elementSize: config.elementSize,
        targetIndex: r,
        lowerBound: config.lowerBoundRow || 0
      });
    } else {
      if (config.ordering === 'CMO') {
        return this.calculate2DCMO({
          baseAddress: config.baseAddress,
          elementSize: config.elementSize,
          totalRows: config.totalRows,
          totalCols: config.totalCols,
          targetRow: r,
          targetCol: c,
          lowerBoundRow: config.lowerBoundRow || 0,
          lowerBoundCol: config.lowerBoundCol || 0
        });
      } else {
        return this.calculate2DRMO({
          baseAddress: config.baseAddress,
          elementSize: config.elementSize,
          totalRows: config.totalRows,
          totalCols: config.totalCols,
          targetRow: r,
          targetCol: c,
          lowerBoundRow: config.lowerBoundRow || 0,
          lowerBoundCol: config.lowerBoundCol || 0
        });
      }
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ArrayCalculator;
}
