/**
 * Array Operations & Algorithm Step Generator Module
 * Handles Insertion, Deletion, Linear Search, and Binary Search simulations.
 */

class ArrayOperations {
  /**
   * Run Linear Search on array data and return animation frames
   * @param {Array} arrayData 1D or flattened 2D array elements
   * @param {number|string} searchValue 
   * @param {Object} config Array config (baseAddress, elementSize, etc.)
   */
  static runLinearSearch(arrayData, searchValue, config) {
    const steps = [];
    const targetVal = String(searchValue).trim();
    let found = false;
    let foundIndex = -1;

    for (let i = 0; i < arrayData.length; i++) {
      const item = arrayData[i];
      const addressInfo = ArrayCalculator.getCellAddress(config, item.row, item.col);
      const isMatch = String(item.value).trim() === targetVal;

      steps.push({
        stepIndex: i + 1,
        type: 'INSPECT',
        inspectRow: item.row,
        inspectCol: item.col,
        inspectIndex: i,
        cellAddress: addressInfo.finalAddress,
        cellAddressHex: addressInfo.finalAddressHex,
        currentValue: item.value,
        searchValue: targetVal,
        isMatch,
        log: `Step ${i + 1}: Inspecting cell [${config.dimension === '1D' ? item.row : item.row + ',' + item.col}] at Address ${addressInfo.finalAddressHex} (${addressInfo.finalAddress}). Value = "${item.value}" vs Target = "${targetVal}". ${isMatch ? 'MATCH FOUND! 🎉' : 'No match.'}`
      });

      if (isMatch) {
        found = true;
        foundIndex = i;
        break;
      }
    }

    if (!found) {
      steps.push({
        stepIndex: steps.length + 1,
        type: 'NOT_FOUND',
        log: `Search Complete: Target value "${targetVal}" was not found in the array after ${steps.length} checks.`
      });
    }

    return {
      found,
      foundIndex,
      totalSteps: steps.length,
      steps
    };
  }

  /**
   * Run Binary Search on sorted 1D array data
   * @param {Array} arrayData 1D array elements (assumed sorted)
   * @param {number|string} searchValue 
   * @param {Object} config 
   */
  static runBinarySearch(arrayData, searchValue, config) {
    const steps = [];
    const targetVal = Number(searchValue);
    let low = 0;
    let high = arrayData.length - 1;
    let found = false;
    let foundIndex = -1;
    let stepCount = 0;

    // Ensure numeric sorting check representation
    while (low <= high) {
      stepCount++;
      const mid = Math.floor((low + high) / 2);
      const item = arrayData[mid];
      const addressInfo = ArrayCalculator.getCellAddress(config, item.row, item.col);
      const midVal = Number(item.value);

      const isMatch = midVal === targetVal;

      steps.push({
        stepIndex: stepCount,
        type: 'INSPECT_MID',
        low,
        high,
        mid,
        inspectRow: item.row,
        inspectCol: item.col,
        cellAddress: addressInfo.finalAddress,
        cellAddressHex: addressInfo.finalAddressHex,
        midValue: midVal,
        searchValue: targetVal,
        isMatch,
        log: `Step ${stepCount}: Low = ${low}, High = ${high} ➔ Mid = floor((${low} + ${high})/2) = ${mid}. Inspecting A[${mid}] at Address ${addressInfo.finalAddressHex} (${addressInfo.finalAddress}). Mid Value = ${midVal} vs Target = ${targetVal}.`
      });

      if (isMatch) {
        found = true;
        foundIndex = mid;
        steps[steps.length - 1].log += ` MATCH FOUND at index ${mid}! 🎉`;
        break;
      } else if (midVal < targetVal) {
        steps[steps.length - 1].log += ` (${midVal} < ${targetVal}) ➔ Search right half (low = ${mid + 1}).`;
        low = mid + 1;
      } else {
        steps[steps.length - 1].log += ` (${midVal} > ${targetVal}) ➔ Search left half (high = ${mid - 1}).`;
        high = mid - 1;
      }
    }

    if (!found) {
      steps.push({
        stepIndex: stepCount + 1,
        type: 'NOT_FOUND',
        low,
        high,
        log: `Binary Search Complete: Target value ${targetVal} not found in array.`
      });
    }

    return {
      found,
      foundIndex,
      totalSteps: steps.length,
      steps
    };
  }

  /**
   * Simulate Insertion in 1D array
   * @param {Array} arrayData Current array elements
   * @param {number} insertIndex Target index to insert at
   * @param {number|string} newValue Value to insert
   * @param {Object} config 
   */
  static simulateInsertion(arrayData, insertIndex, newValue, config) {
    const idx = Math.max(0, Math.min(insertIndex, arrayData.length));
    const newArray = [...arrayData];
    
    // Shift elements right from insertIndex
    const steps = [];
    steps.push({
      type: 'INIT_INSERT',
      log: `Initiating Insertion of value "${newValue}" at index ${idx}.`
    });

    for (let i = newArray.length - 1; i >= idx; i--) {
      const fromAddr = ArrayCalculator.getCellAddress(config, i);
      const toAddr = ArrayCalculator.getCellAddress(config, i + 1);
      steps.push({
        type: 'SHIFT_RIGHT',
        fromIndex: i,
        toIndex: i + 1,
        fromAddressHex: fromAddr.finalAddressHex,
        toAddressHex: toAddr.finalAddressHex,
        value: newArray[i] ? newArray[i].value : 0,
        log: `Shifting element at index ${i} (${fromAddr.finalAddressHex}) to index ${i + 1} (${toAddr.finalAddressHex}).`
      });
    }

    // Insert new element
    const insertedAddr = ArrayCalculator.getCellAddress(config, idx);
    steps.push({
      type: 'PLACE_VALUE',
      insertIndex: idx,
      insertedAddressHex: insertedAddr.finalAddressHex,
      newValue,
      log: `Placed new value "${newValue}" at index ${idx} (Memory Address: ${insertedAddr.finalAddressHex} / ${insertedAddr.finalAddress}).`
    });

    return { steps, insertIndex: idx, insertedAddress: insertedAddr };
  }

  /**
   * Simulate Deletion in 1D array
   * @param {Array} arrayData Current array elements
   * @param {number} deleteIndex Target index to delete
   * @param {Object} config 
   */
  static simulateDeletion(arrayData, deleteIndex, config) {
    const idx = Math.max(0, Math.min(deleteIndex, arrayData.length - 1));
    const deletedItem = arrayData[idx];
    const deletedAddr = ArrayCalculator.getCellAddress(config, idx);

    const steps = [];
    steps.push({
      type: 'INIT_DELETE',
      deleteIndex: idx,
      deletedValue: deletedItem ? deletedItem.value : null,
      deletedAddressHex: deletedAddr.finalAddressHex,
      log: `Deleting element "${deletedItem ? deletedItem.value : ''}" at index ${idx} (Address: ${deletedAddr.finalAddressHex}).`
    });

    for (let i = idx; i < arrayData.length - 1; i++) {
      const fromAddr = ArrayCalculator.getCellAddress(config, i + 1);
      const toAddr = ArrayCalculator.getCellAddress(config, i);
      steps.push({
        type: 'SHIFT_LEFT',
        fromIndex: i + 1,
        toIndex: i,
        fromAddressHex: fromAddr.finalAddressHex,
        toAddressHex: toAddr.finalAddressHex,
        value: arrayData[i + 1] ? arrayData[i + 1].value : 0,
        log: `Shifting element at index ${i + 1} (${arrayData[i + 1] ? arrayData[i + 1].value : ''}) left into index ${i} (${toAddr.finalAddressHex}).`
      });
    }

    steps.push({
      type: 'COMPLETE_DELETE',
      log: `Deletion complete. Array size updated.`
    });

    return { steps, deleteIndex: idx, deletedAddress: deletedAddr };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ArrayOperations;
}
