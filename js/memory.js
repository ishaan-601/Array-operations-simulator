/**
 * Memory & Logical Grid Visualizer Module
 * Handles dynamic grid generation, physical memory strip rendering, and Physical RAM Layout visualizer.
 */

class MemoryVisualizer {
  constructor(gridContainerId, memoryStripContainerId, ramLayoutContainerId, onCellSelectCallback) {
    this.gridContainer = document.getElementById(gridContainerId);
    this.memoryStripContainer = document.getElementById(memoryStripContainerId);
    this.ramLayoutContainer = document.getElementById(ramLayoutContainerId);
    this.onCellSelect = onCellSelectCallback;
    this.arrayData = [];
  }

  /**
   * Initialize matrix data with sample values
   */
  generateSampleData(config) {
    const R = config.dimension === '1D' ? 1 : config.totalRows;
    const C = config.dimension === '1D' ? config.totalRows : config.totalCols;
    const data = [];

    let sampleValues;
    if (config.dimension === '1D') {
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
   * Render Interactive Logical Grid
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
    gridTable.className = 'inline-grid gap-3 p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/20 shadow-2xl';
    
    gridTable.style.gridTemplateColumns = is1D 
      ? `repeat(${C}, minmax(95px, 1fr))` 
      : `auto repeat(${C}, minmax(100px, 1fr))`;

    // 1. Column Headers
    if (!is1D) {
      const originHeader = document.createElement('div');
      originHeader.className = 'flex items-center justify-center text-xs font-mono font-bold text-slate-500 p-2 border-b border-r border-slate-800';
      originHeader.innerText = 'R \\ C';
      gridTable.appendChild(originHeader);

      for (let c = 0; c < C; c++) {
        const colHeader = document.createElement('div');
        colHeader.className = 'flex items-center justify-center text-xs font-mono font-bold text-cyan-400 p-2 border-b border-slate-800';
        colHeader.innerText = `C[${c + (config.lowerBoundCol || 0)}]`;
        gridTable.appendChild(colHeader);
      }
    }

    // 2. Render Rows & Cells
    for (let r = 0; r < R; r++) {
      if (!is1D) {
        const rowHeader = document.createElement('div');
        rowHeader.className = 'flex items-center justify-center text-xs font-mono font-bold text-purple-400 p-2 border-r border-slate-800';
        rowHeader.innerText = `R[${r + (config.lowerBoundRow || 0)}]`;
        gridTable.appendChild(rowHeader);
      }

      for (let c = 0; c < C; c++) {
        const item = this.arrayData.find(d => d.row === r && d.col === c) || { row: r, col: c, value: 0 };
        const addressInfo = ArrayCalculator.getCellAddress(config, r, c);
        
        const cell = document.createElement('div');
        cell.className = 'grid-cell p-3 flex flex-col items-center justify-between min-h-[95px] shadow-lg select-none';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.title = `Cell A[${is1D ? r : r + ',' + c}]\nMemory Address: ${addressInfo.finalAddressHex} (${addressInfo.finalAddress})\nElement Size: ${config.elementSize} bytes`;

        const isTarget = is1D ? (r === config.targetIndex) : (r === config.targetRow && c === config.targetCol);
        const isBase = is1D ? (r === (config.lowerBoundRow || 0)) : (r === (config.lowerBoundRow || 0) && c === (config.lowerBoundCol || 0));

        if (isTarget) cell.classList.add('target-cell');
        if (isBase) cell.classList.add('base-cell');

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

        const indexTag = document.createElement('span');
        indexTag.className = 'text-[11px] font-mono font-semibold text-slate-400 border-b border-slate-800/80 w-full text-center pb-1';
        indexTag.innerText = is1D ? `A[${r}]` : `A[${r}][${c}]`;

        const valSpan = document.createElement('span');
        valSpan.className = 'text-base font-bold text-slate-100 my-1 font-mono tracking-wide';
        valSpan.innerText = item.value !== undefined ? item.value : '-';

        const addrSpan = document.createElement('span');
        addrSpan.className = 'text-[10px] font-mono font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50 shadow-sm';
        addrSpan.innerText = addressInfo.finalAddressHex;

        cell.appendChild(indexTag);
        cell.appendChild(valSpan);
        cell.appendChild(addrSpan);

        cell.addEventListener('click', () => {
          if (this.onCellSelect) this.onCellSelect(r, c);
        });

        gridTable.appendChild(cell);
      }
    }

    wrapper.appendChild(gridTable);
    this.gridContainer.appendChild(wrapper);

    // Also update physical memory strip and RAM hardware layout
    this.renderPhysicalMemoryStrip(config, activeHighlights);
    this.renderPhysicalRamLayout(config, activeHighlights);
  }

  /**
   * Render Physical Memory Strip View
   */
  renderPhysicalMemoryStrip(config, activeHighlights = {}) {
    if (!this.memoryStripContainer) return;
    this.memoryStripContainer.innerHTML = '';

    const is1D = config.dimension === '1D';
    const isRMO = config.ordering === 'RMO';
    const R = is1D ? 1 : config.totalRows;
    const C = is1D ? config.totalRows : config.totalCols;

    const contiguousList = [];
    if (is1D) {
      for (let r = 0; r < C; r++) contiguousList.push({ r, c: 0 });
    } else if (isRMO) {
      for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) contiguousList.push({ r, c });
      }
    } else {
      for (let c = 0; c < C; c++) {
        for (let r = 0; r < R; r++) contiguousList.push({ r, c });
      }
    }

    const stripWrapper = document.createElement('div');
    stripWrapper.className = 'w-full overflow-x-auto py-3 px-2 flex items-center gap-2';

    contiguousList.forEach((item, idx) => {
      const addressInfo = ArrayCalculator.getCellAddress(config, item.r, item.c);
      const dataItem = this.arrayData.find(d => d.row === item.r && d.col === item.c) || { value: 0 };
      
      const block = document.createElement('div');
      block.className = 'memory-strip-block flex-shrink-0 flex flex-col items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/90 shadow text-center cursor-pointer transition-all hover:border-cyan-400 hover:scale-105';
      
      const isTarget = is1D ? (item.r === config.targetIndex) : (item.r === config.targetRow && item.c === config.targetCol);
      if (isTarget) {
        block.classList.add('border-cyan-400', 'bg-cyan-950/40', 'ring-2', 'ring-cyan-400/50');
      }

      if (activeHighlights.inspectRow === item.r && activeHighlights.inspectCol === item.c) {
        block.classList.add('border-amber-400', 'bg-amber-950/50', 'ring-2', 'ring-amber-400/80');
      }

      const byteStart = addressInfo.finalAddress;
      const byteEnd = addressInfo.finalAddress + config.elementSize - 1;

      block.innerHTML = `
        <div class="text-[10px] font-mono text-slate-400">Byte ${byteStart}..${byteEnd}</div>
        <div class="text-xs font-mono font-bold text-cyan-400 my-1">${addressInfo.finalAddressHex}</div>
        <div class="text-sm font-bold text-slate-100 font-mono">${dataItem.value}</div>
        <div class="text-[10px] font-mono text-purple-400 mt-1 font-semibold">${is1D ? `A[${item.r}]` : `A[${item.r}][${item.c}]`}</div>
      `;

      block.addEventListener('click', () => {
        if (this.onCellSelect) this.onCellSelect(item.r, item.c);
      });

      stripWrapper.appendChild(block);

      if (idx < contiguousList.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'text-cyan-500/40 text-xs flex-shrink-0';
        arrow.innerHTML = '➔';
        stripWrapper.appendChild(arrow);
      }
    });

    this.memoryStripContainer.appendChild(stripWrapper);
  }

  /**
   * Render Physical Hardware RAM Module Layout & Highlight Blocked Memory
   */
  renderPhysicalRamLayout(config, activeHighlights = {}) {
    if (!this.ramLayoutContainer) return;
    this.ramLayoutContainer.innerHTML = '';

    const baseAddr = ArrayCalculator.parseBaseAddress(config.baseAddress);
    const W = config.elementSize;
    const is1D = config.dimension === '1D';
    const R = is1D ? 1 : config.totalRows;
    const C = is1D ? config.totalRows : config.totalCols;
    const totalElements = R * C;
    const totalArrayBytes = totalElements * W;
    const endArrayAddr = baseAddr + totalArrayBytes - 1;

    // Determine target element details
    const targetRow = is1D ? config.targetIndex : config.targetRow;
    const targetCol = is1D ? 0 : config.targetCol;
    const targetCalc = ArrayCalculator.getCellAddress(config, targetRow, targetCol);
    const targetByteStart = targetCalc.finalAddress;
    const targetByteEnd = targetByteStart + W - 1;

    // RAM Module Shell Wrapper
    const ramShell = document.createElement('div');
    ramShell.className = 'ram-stick-container p-5 flex flex-col gap-4 text-xs font-mono';

    // Hardware Stick Top Metadata Banner
    const ramHeader = document.createElement('div');
    ramHeader.className = 'flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3';
    ramHeader.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fas fa-microchip text-cyan-400 text-lg animate-pulse"></i>
        <div>
          <span class="font-bold text-slate-100 tracking-wider">HARDWARE PHYSICAL RAM MODULE</span>
          <span class="text-[11px] text-cyan-400 ml-2">[DDR5 DRAM • Bank Segment 0x${ArrayCalculator.formatHex(baseAddr - 16)}]</span>
        </div>
      </div>

      <div class="flex items-center gap-3 text-[11px]">
        <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-emerald-500/40 text-emerald-400 font-semibold">
          <i class="fas fa-play text-[9px] mr-1"></i> Base: ${ArrayCalculator.formatHex(baseAddr)}
        </span>
        <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-purple-500/40 text-purple-400 font-semibold">
          <i class="fas fa-lock text-[9px] mr-1"></i> Target Blocked: ${ArrayCalculator.formatHex(targetByteStart)}..${ArrayCalculator.formatHex(targetByteEnd)}
        </span>
        <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-cyan-500/40 text-cyan-300 font-semibold">
          Total Array Size: ${totalArrayBytes} Bytes
        </span>
      </div>
    `;
    ramShell.appendChild(ramHeader);

    // RAM Memory Grid Layout (Unallocated Buffer + Array Allocated + Target Cell Blocked + System Buffer)
    const ramGrid = document.createElement('div');
    ramGrid.className = 'grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5 my-2';

    // Show buffer bytes before base address
    const bufferBytesBefore = 4;
    for (let b = bufferBytesBefore; b >= 1; b--) {
      const addr = baseAddr - b * W;
      const cell = document.createElement('div');
      cell.className = 'ram-chip-block p-2 flex flex-col justify-between items-center h-[72px] border border-slate-800 bg-slate-950/60 opacity-60';
      cell.innerHTML = `
        <span class="text-[9px] text-slate-500">SYS_BUFF</span>
        <span class="text-[10px] text-slate-400 font-bold">${ArrayCalculator.formatHex(addr)}</span>
        <span class="text-[9px] text-slate-600">UNALLOCATED</span>
      `;
      ramGrid.appendChild(cell);
    }

    // Render Array Elements in Physical RAM
    for (let i = 0; i < totalElements; i++) {
      let r, c;
      if (is1D) {
        r = i; c = 0;
      } else if (config.ordering === 'RMO') {
        r = Math.floor(i / C); c = i % C;
      } else {
        c = Math.floor(i / R); r = i % R;
      }

      const addressInfo = ArrayCalculator.getCellAddress(config, r, c);
      const isTargetCell = is1D ? (r === config.targetIndex) : (r === config.targetRow && c === config.targetCol);
      const isBaseCell = (r === (config.lowerBoundRow || 0) && c === (config.lowerBoundCol || 0));

      const item = this.arrayData.find(d => d.row === r && d.col === c) || { value: 0 };
      const cellAddrStart = addressInfo.finalAddress;
      const cellAddrEnd = cellAddrStart + W - 1;

      const ramCell = document.createElement('div');
      ramCell.className = 'ram-chip-block p-2.5 flex flex-col justify-between items-center h-[80px] rounded-xl border transition-all cursor-pointer';

      if (isTargetCell) {
        ramCell.classList.add('border-purple-500', 'bg-purple-950/60', 'shadow-lg', 'shadow-purple-500/30', 'scale-105', 'z-10');
        ramCell.innerHTML = `
          <div class="w-full flex items-center justify-between text-[9px]">
            <span class="text-purple-300 font-bold"><i class="fas fa-lock text-[8px] mr-0.5"></i>BLOCKED</span>
            <span class="text-purple-400 font-bold">${W}B</span>
          </div>
          <span class="text-xs font-bold text-white my-0.5">${addressInfo.finalAddressHex}</span>
          <span class="text-[10px] text-purple-200 font-bold font-mono">Val: ${item.value}</span>
          <span class="text-[9px] text-purple-300 font-semibold">${is1D ? `A[${r}]` : `A[${r}][${c}]`}</span>
        `;
      } else if (isBaseCell) {
        ramCell.classList.add('border-emerald-500', 'bg-emerald-950/40', 'shadow-md');
        ramCell.innerHTML = `
          <div class="w-full flex items-center justify-between text-[9px]">
            <span class="text-emerald-400 font-bold">BASE</span>
            <span class="text-emerald-500 font-bold">${W}B</span>
          </div>
          <span class="text-xs font-bold text-emerald-300 my-0.5">${addressInfo.finalAddressHex}</span>
          <span class="text-[10px] text-emerald-200 font-bold font-mono">Val: ${item.value}</span>
          <span class="text-[9px] text-emerald-400 font-semibold">${is1D ? `A[${r}]` : `A[${r}][${c}]`}</span>
        `;
      } else {
        ramCell.classList.add('border-cyan-500/30', 'bg-cyan-950/20', 'hover:border-cyan-400');
        ramCell.innerHTML = `
          <div class="w-full flex items-center justify-between text-[9px]">
            <span class="text-cyan-400 font-bold">ALLOC</span>
            <span class="text-slate-400">${W}B</span>
          </div>
          <span class="text-xs font-bold text-cyan-300 my-0.5">${addressInfo.finalAddressHex}</span>
          <span class="text-[10px] text-slate-300 font-bold font-mono">Val: ${item.value}</span>
          <span class="text-[9px] text-slate-400 font-medium">${is1D ? `A[${r}]` : `A[${r}][${c}]`}</span>
        `;
      }

      ramCell.addEventListener('click', () => {
        if (this.onCellSelect) this.onCellSelect(r, c);
      });

      ramGrid.appendChild(ramCell);
    }

    // Show buffer bytes after array end
    const bufferBytesAfter = 4;
    for (let b = 1; b <= bufferBytesAfter; b++) {
      const addr = endArrayAddr + b * W;
      const cell = document.createElement('div');
      cell.className = 'ram-chip-block p-2 flex flex-col justify-between items-center h-[72px] border border-slate-800 bg-slate-950/60 opacity-60';
      cell.innerHTML = `
        <span class="text-[9px] text-slate-500">SYS_BUFF</span>
        <span class="text-[10px] text-slate-400 font-bold">${ArrayCalculator.formatHex(addr)}</span>
        <span class="text-[9px] text-slate-600">FREE RAM</span>
      `;
      ramGrid.appendChild(cell);
    }

    ramShell.appendChild(ramGrid);

    // RAM Bottom Status Bar Callout
    const ramFooter = document.createElement('div');
    ramFooter.className = 'flex items-center justify-between pt-3 border-t border-cyan-500/20 text-[11px] text-slate-400';
    ramFooter.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></span>
        <span class="text-slate-200">Selected Target Cell <strong class="text-purple-400">${is1D ? `A[${targetRow}]` : `A[${targetRow}][${targetCol}]`}</strong> locks <strong>${W} Bytes</strong> in physical DRAM from <code class="text-purple-300 font-bold">${ArrayCalculator.formatHex(targetByteStart)}</code> to <code class="text-purple-300 font-bold">${ArrayCalculator.formatHex(targetByteEnd)}</code>.</span>
      </div>
      <div class="text-cyan-400 font-mono text-[10px] font-semibold">BUS WIDTH: 64-BIT CONTIGUOUS</div>
    `;
    ramShell.appendChild(ramFooter);

    this.ramLayoutContainer.appendChild(ramShell);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MemoryVisualizer;
}
