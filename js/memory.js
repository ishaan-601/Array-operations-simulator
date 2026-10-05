/**
 * Memory & Logical Grid Visualizer Module
 * Handles dynamic grid generation, physical memory strip rendering, and interactive cell events.
 */

class MemoryVisualizer {
  constructor(gridContainerId, memoryStripContainerId, onCellSelectCallback) {
    this.gridContainer = document.getElementById(gridContainerId);
    this.memoryStripContainer = document.getElementById(memoryStripContainerId);
    this.onCellSelect = onCellSelectCallback;
    this.arrayData = [];
  }

  /**
   * Initialize matrix data with initial default sample values
   */
  generateSampleData(config) {
    const R = config.dimension === '1D' ? 1 : config.totalRows;
    const C = config.dimension === '1D' ? config.totalRows : config.totalCols;
    const data = [];

    let sampleValues;
    if (config.dimension === '1D') {
      // Default sorted array for nice binary search testing
      sampleValues = [10, 25, 38, 42, 57, 63, 79, 84, 91, 105, 120, 145];
    } else {
      sampleValues = [
        12, 45, 67, 89, 23, 56, 78, 90, 34, 65, 87, 19,
        31, 54, 76, 98, 21, 43, 85, 97, 14, 28, 49, 62
      ];
    }

    let valIdx = 0;
    if (config.dimension === '1D') {
      for (let i = 0; i < C; i++) {
        data.push({
          row: i,
          col: 0,
          value: sampleValues[i % sampleValues.length]
        });
      }
    } else {
      for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
          data.push({
            row: r,
            col: c,
            value: sampleValues[valIdx % sampleValues.length]
          });
          valIdx++;
        }
      }
    }
    this.arrayData = data;
    return data;
  }

  /**
   * Render the Interactive Logical Grid
   */
  renderLogicalGrid(config, activeHighlights = {}) {
    if (!this.gridContainer) return;
    this.gridContainer.innerHTML = '';

    const R = config.dimension === '1D' ? 1 : config.totalRows;
    const C = config.dimension === '1D' ? config.totalRows : config.totalCols;
    const is1D = config.dimension === '1D';

    const wrapper = document.createElement('div');
    wrapper.className = 'w-full overflow-x-auto p-4 flex flex-col items-center justify-center';

    const gridTable = document.createElement('div');
    gridTable.className = 'inline-grid gap-2 p-2 rounded-xl bg-slate-900/40 dark:bg-slate-900/60 border border-slate-700/50 shadow-inner';
    
    // Setup Grid Template Columns (Col index header + C columns)
    const gridCols = is1D ? C : C + 1;
    gridTable.style.gridTemplateColumns = is1D 
      ? `repeat(${C}, minmax(90px, 1fr))` 
      : `auto repeat(${C}, minmax(95px, 1fr))`;

    // 1. Column Headers (if 2D or 1D index header)
    if (!is1D) {
      // Top-left empty origin header
      const originHeader = document.createElement('div');
      originHeader.className = 'flex items-center justify-center text-xs font-semibold text-slate-400 p-2 border-b border-r border-slate-700';
      originHeader.innerText = 'R \\ C';
      gridTable.appendChild(originHeader);

      for (let c = 0; c < C; c++) {
        const colHeader = document.createElement('div');
        colHeader.className = 'flex items-center justify-center text-xs font-bold text-blue-400 p-2 border-b border-slate-700';
        colHeader.innerText = `Col ${c + (config.lowerBoundCol || 0)}`;
        gridTable.appendChild(colHeader);
      }
    }

    // 2. Render Rows and Cells
    for (let r = 0; r < R; r++) {
      if (!is1D) {
        const rowHeader = document.createElement('div');
        rowHeader.className = 'flex items-center justify-center text-xs font-bold text-indigo-400 p-2 border-r border-slate-700';
        rowHeader.innerText = `Row ${r + (config.lowerBoundRow || 0)}`;
        gridTable.appendChild(rowHeader);
      }

      for (let c = 0; c < C; c++) {
        const item = this.arrayData.find(d => d.row === r && d.col === c) || { row: r, col: c, value: 0 };
        const addressInfo = ArrayCalculator.getCellAddress(config, r, c);
        
        const cell = document.createElement('div');
        cell.className = 'grid-cell rounded-lg p-3 flex flex-col items-center justify-between min-h-[90px] shadow-sm select-none transition-all';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.title = `Cell A[${is1D ? r : r + ',' + c}]\nMemory Address: ${addressInfo.finalAddressHex} (${addressInfo.finalAddress})\nElement Size: ${config.elementSize} bytes`;

        // Highlight classes
        const isTarget = is1D ? (r === config.targetIndex) : (r === config.targetRow && c === config.targetCol);
        const isBase = is1D ? (r === (config.lowerBoundRow || 0)) : (r === (config.lowerBoundRow || 0) && c === (config.lowerBoundCol || 0));

        if (isTarget) cell.classList.add('target-cell');
        if (isBase) cell.classList.add('base-cell');

        // Dynamic operation highlights
        if (activeHighlights.inspectRow === r && activeHighlights.inspectCol === c) {
          cell.classList.add('active-inspect');
        }
        if (activeHighlights.foundRow === r && activeHighlights.foundCol === c) {
          cell.classList.add('found-cell');
        }
        if (activeHighlights.insertedRow === r && activeHighlights.insertedCol === c) {
          cell.classList.add('inserted-cell');
        }
        if (activeHighlights.shiftingRow === r && activeHighlights.shiftingCol === c) {
          cell.classList.add('shifting-cell');
        }
        if (activeHighlights.lowMidHigh) {
          if (r === activeHighlights.lowMidHigh.mid && is1D) {
            cell.classList.add('active-inspect');
          } else if (r >= activeHighlights.lowMidHigh.low && r <= activeHighlights.lowMidHigh.high && is1D) {
            cell.classList.add('low-high-range');
          }
        }

        // Inner Content
        const indexTag = document.createElement('span');
        indexTag.className = 'text-[11px] font-mono font-medium text-slate-400 border-b border-slate-700/40 w-full text-center pb-1';
        indexTag.innerText = is1D ? `A[${r}]` : `A[${r}][${c}]`;

        const valSpan = document.createElement('span');
        valSpan.className = 'text-base font-bold text-slate-100 my-1 font-mono';
        valSpan.innerText = item.value !== undefined ? item.value : '-';

        const addrSpan = document.createElement('span');
        addrSpan.className = 'text-[10px] font-mono text-emerald-400 bg-emerald-950/40 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40';
        addrSpan.innerText = addressInfo.finalAddressHex;

        cell.appendChild(indexTag);
        cell.appendChild(valSpan);
        cell.appendChild(addrSpan);

        // Interactive Click listener
        cell.addEventListener('click', () => {
          if (this.onCellSelect) {
            this.onCellSelect(r, c);
          }
        });

        gridTable.appendChild(cell);
      }
    }

    wrapper.appendChild(gridTable);
    this.gridContainer.appendChild(wrapper);

    // Also update physical memory strip view
    this.renderPhysicalMemoryStrip(config, activeHighlights);
  }

  /**
   * Render Physical Memory Strip View showing contiguous memory layout
   */
  renderPhysicalMemoryStrip(config, activeHighlights = {}) {
    if (!this.memoryStripContainer) return;
    this.memoryStripContainer.innerHTML = '';

    const is1D = config.dimension === '1D';
    const isRMO = config.ordering === 'RMO';
    const R = is1D ? 1 : config.totalRows;
    const C = is1D ? config.totalRows : config.totalCols;

    // Build contiguous layout order based on 1D, RMO, or CMO
    const contiguousList = [];

    if (is1D) {
      for (let r = 0; r < C; r++) {
        contiguousList.push({ r, c: 0 });
      }
    } else if (isRMO) {
      for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
          contiguousList.push({ r, c });
        }
      }
    } else {
      // CMO: iterate col first then row
      for (let c = 0; c < C; c++) {
        for (let r = 0; r < R; r++) {
          contiguousList.push({ r, c });
        }
      }
    }

    const stripWrapper = document.createElement('div');
    stripWrapper.className = 'w-full overflow-x-auto py-3 px-2 flex items-center gap-2';

    contiguousList.forEach((item, idx) => {
      const addressInfo = ArrayCalculator.getCellAddress(config, item.r, item.c);
      const dataItem = this.arrayData.find(d => d.row === item.r && d.col === item.c) || { value: 0 };
      
      const block = document.createElement('div');
      block.className = 'memory-strip-block flex-shrink-0 flex flex-col items-center justify-between p-2.5 rounded-lg border border-slate-700 bg-slate-800/80 shadow text-center cursor-pointer transition-all hover:border-blue-500 hover:scale-105';
      
      const isTarget = is1D ? (item.r === config.targetIndex) : (item.r === config.targetRow && item.c === config.targetCol);
      if (isTarget) {
        block.classList.add('border-blue-500', 'bg-blue-950/40', 'ring-2', 'ring-blue-500/50');
      }

      if (activeHighlights.inspectRow === item.r && activeHighlights.inspectCol === item.c) {
        block.classList.add('border-amber-500', 'bg-amber-950/50', 'ring-2', 'ring-amber-500/80');
      }

      const byteStart = addressInfo.finalAddress;
      const byteEnd = addressInfo.finalAddress + config.elementSize - 1;

      block.innerHTML = `
        <div class="text-[10px] font-mono text-slate-400">Byte ${byteStart}..${byteEnd}</div>
        <div class="text-xs font-mono font-bold text-blue-400 my-1">${addressInfo.finalAddressHex}</div>
        <div class="text-sm font-bold text-slate-200">${dataItem.value}</div>
        <div class="text-[10px] font-mono text-slate-400 mt-1">${is1D ? `A[${item.r}]` : `A[${item.r}][${item.c}]`}</div>
      `;

      block.addEventListener('click', () => {
        if (this.onCellSelect) {
          this.onCellSelect(item.r, item.c);
        }
      });

      stripWrapper.appendChild(block);

      // Add contiguous memory arrow if not last
      if (idx < contiguousList.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'text-slate-600 text-xs flex-shrink-0';
        arrow.innerHTML = '➔';
        stripWrapper.appendChild(arrow);
      }
    });

    this.memoryStripContainer.appendChild(stripWrapper);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MemoryVisualizer;
}
