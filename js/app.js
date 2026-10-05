/**
 * Main Application Controller (js/app.js)
 * Manages state, event listeners, multi-theme engine, view mode switcher, operation stepper, and UI updates.
 */

document.addEventListener('DOMContentLoaded', () => {
  // App State Configuration
  const state = {
    dimension: '2D', // '1D' or '2D'
    ordering: 'RMO', // 'RMO' or 'CMO'
    baseAddress: '1000',
    elementSize: 4, // in bytes
    totalRows: 4,
    totalCols: 4,
    targetRow: 2,
    targetCol: 1,
    targetIndex: 2, // for 1D
    lowerBoundRow: 0,
    lowerBoundCol: 0,
    activeTab: 'calc', // 'calc', 'insert', 'delete', 'linear', 'binary'
    searchValue: '78',
    insertValue: '99',
    theme: 'crystal', // 'crystal', 'neon', 'obsidian', 'light-frost'
    viewMode: 'all', // 'all', 'matrix', 'ram', 'strip'
    // Stepper State
    animation: {
      isPlaying: false,
      timer: null,
      currentStep: 0,
      totalSteps: 0,
      stepsData: [],
      speedMs: 800
    }
  };

  // DOM Elements
  const elDimension = document.getElementById('input-dimension');
  const elOrdering = document.getElementById('input-ordering');
  const elOrderingWrapper = document.getElementById('ordering-wrapper');
  const elBaseAddress = document.getElementById('input-base-address');
  const elElementSize = document.getElementById('input-element-size');
  const elTotalRows = document.getElementById('input-total-rows');
  const elTotalCols = document.getElementById('input-total-cols');
  const elTotalColsWrapper = document.getElementById('total-cols-wrapper');
  const elRowsLabel = document.getElementById('label-total-rows');
  
  const elTargetRow = document.getElementById('input-target-row');
  const elTargetCol = document.getElementById('input-target-col');
  const elTargetColWrapper = document.getElementById('target-col-wrapper');
  const elTargetRowLabel = document.getElementById('label-target-row');

  // Operation Tab Controls
  const elSearchValue = document.getElementById('input-search-value');
  const elInsertValue = document.getElementById('input-insert-value');
  const elOpValueWrapper = document.getElementById('op-value-wrapper');

  // Output Displays
  const elResultDecimal = document.getElementById('result-decimal');
  const elResultHex = document.getElementById('result-hex');
  const elResultOffset = document.getElementById('result-offset');
  const elFormulaRaw = document.getElementById('formula-raw');
  const elStepsContainer = document.getElementById('calculation-steps-container');
  const elOperationLogs = document.getElementById('operation-logs-container');

  // View Containers
  const cardMatrix = document.getElementById('card-matrix');
  const cardRam = document.getElementById('ram-layout-container');
  const cardStrip = document.getElementById('card-strip');

  // Stepper Controls
  const elBtnPlay = document.getElementById('btn-play');
  const elBtnPrev = document.getElementById('btn-prev');
  const elBtnNext = document.getElementById('btn-next');
  const elBtnReset = document.getElementById('btn-reset');
  const elSpeedSlider = document.getElementById('speed-slider');
  const elSpeedValue = document.getElementById('speed-value');
  const elStepIndicator = document.getElementById('step-indicator');

  // Presets, Theme & View Switchers
  const elPresetSelect = document.getElementById('preset-select');
  const elThemeSelect = document.getElementById('theme-select');
  const viewModeButtons = document.querySelectorAll('.view-mode-btn');

  // Initialize Memory Visualizer
  const visualizer = new MemoryVisualizer(
    'grid-visualizer-container', 
    'memory-strip-container', 
    'ram-layout-container',
    (r, c) => {
      if (state.dimension === '1D') {
        state.targetIndex = r;
        elTargetRow.value = r;
      } else {
        state.targetRow = r;
        state.targetCol = c;
        elTargetRow.value = r;
        elTargetCol.value = c;
      }
      recalculateAll();
    }
  );

  // Generate initial sample data
  visualizer.generateSampleData(state);

  /**
   * Set Active Theme on root HTML element
   */
  function applyTheme(themeName) {
    state.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    if (elThemeSelect) elThemeSelect.value = themeName;
  }

  /**
   * Set Active View Mode (All, Matrix, RAM, Strip)
   */
  function applyViewMode(mode) {
    state.viewMode = mode;
    
    // Update button visual highlights
    viewModeButtons.forEach(btn => {
      if (btn.dataset.mode === mode) {
        btn.classList.add('bg-cyan-500/20', 'border-cyan-400', 'text-cyan-300', 'shadow-lg');
      } else {
        btn.classList.remove('bg-cyan-500/20', 'border-cyan-400', 'text-cyan-300', 'shadow-lg');
      }
    });

    if (mode === 'all') {
      if (cardMatrix) cardMatrix.classList.remove('hidden');
      if (cardRam) cardRam.classList.remove('hidden');
      if (cardStrip) cardStrip.classList.remove('hidden');
    } else if (mode === 'matrix') {
      if (cardMatrix) cardMatrix.classList.remove('hidden');
      if (cardRam) cardRam.classList.add('hidden');
      if (cardStrip) cardStrip.classList.add('hidden');
    } else if (mode === 'ram') {
      if (cardMatrix) cardMatrix.classList.add('hidden');
      if (cardRam) cardRam.classList.remove('hidden');
      if (cardStrip) cardStrip.classList.add('hidden');
    } else if (mode === 'strip') {
      if (cardMatrix) cardMatrix.classList.add('hidden');
      if (cardRam) cardRam.classList.add('hidden');
      if (cardStrip) cardStrip.classList.remove('hidden');
    }
  }

  /**
   * Sync input elements with internal state
   */
  function syncInputsFromState() {
    elDimension.value = state.dimension;
    elOrdering.value = state.ordering;
    elBaseAddress.value = state.baseAddress;
    elElementSize.value = state.elementSize;
    elTotalRows.value = state.totalRows;
    elTotalCols.value = state.totalCols;

    if (state.dimension === '1D') {
      elOrderingWrapper.classList.add('hidden');
      elTotalColsWrapper.classList.add('hidden');
      elTargetColWrapper.classList.add('hidden');
      elRowsLabel.innerText = 'Array Size (N)';
      elTargetRowLabel.innerText = 'Target Index (i)';
      elTargetRow.value = state.targetIndex;
    } else {
      elOrderingWrapper.classList.remove('hidden');
      elTotalColsWrapper.classList.remove('hidden');
      elTargetColWrapper.classList.remove('hidden');
      elRowsLabel.innerText = 'Total Rows (R)';
      elTargetRowLabel.innerText = 'Target Row (i)';
      elTargetRow.value = state.targetRow;
      elTargetCol.value = state.targetCol;
    }

    if (elSearchValue) elSearchValue.value = state.searchValue;
    if (elInsertValue) elInsertValue.value = state.insertValue;
  }

  /**
   * Read state from inputs
   */
  function readStateFromInputs() {
    state.dimension = elDimension.value;
    state.ordering = elOrdering.value;
    state.baseAddress = elBaseAddress.value;
    state.elementSize = Number(elElementSize.value) || 4;
    state.totalRows = Math.max(1, Number(elTotalRows.value) || 1);
    state.totalCols = Math.max(1, Number(elTotalCols.value) || 1);

    if (state.dimension === '1D') {
      state.targetIndex = Math.max(0, Math.min(Number(elTargetRow.value) || 0, state.totalRows - 1));
    } else {
      state.targetRow = Math.max(0, Math.min(Number(elTargetRow.value) || 0, state.totalRows - 1));
      state.targetCol = Math.max(0, Math.min(Number(elTargetCol.value) || 0, state.totalCols - 1));
    }

    if (elSearchValue) state.searchValue = elSearchValue.value;
    if (elInsertValue) state.insertValue = elInsertValue.value;
  }

  /**
   * Main Recalculate & UI Update Pipeline
   */
  function recalculateAll(activeHighlights = {}) {
    readStateFromInputs();
    syncInputsFromState();

    // 1. Compute Address & Step-by-Step Breakdown
    let calcResult;
    if (state.dimension === '1D') {
      calcResult = ArrayCalculator.calculate1D({
        baseAddress: state.baseAddress,
        elementSize: state.elementSize,
        targetIndex: state.targetIndex,
        lowerBound: state.lowerBoundRow
      });
    } else if (state.ordering === 'CMO') {
      calcResult = ArrayCalculator.calculate2DCMO({
        baseAddress: state.baseAddress,
        elementSize: state.elementSize,
        totalRows: state.totalRows,
        totalCols: state.totalCols,
        targetRow: state.targetRow,
        targetCol: state.targetCol,
        lowerBoundRow: state.lowerBoundRow,
        lowerBoundCol: state.lowerBoundCol
      });
    } else {
      calcResult = ArrayCalculator.calculate2DRMO({
        baseAddress: state.baseAddress,
        elementSize: state.elementSize,
        totalRows: state.totalRows,
        totalCols: state.totalCols,
        targetRow: state.targetRow,
        targetCol: state.targetCol,
        lowerBoundRow: state.lowerBoundRow,
        lowerBoundCol: state.lowerBoundCol
      });
    }

    // 2. Render Results Header & Formula
    if (elResultDecimal) elResultDecimal.innerText = `${calcResult.finalAddress}`;
    if (elResultHex) elResultHex.innerText = `${calcResult.finalAddressHex}`;
    if (elResultOffset) elResultOffset.innerText = `+${calcResult.byteOffset} Bytes (${calcResult.totalElementOffset !== undefined ? calcResult.totalElementOffset : calcResult.relativeIndex} elements offset)`;
    if (elFormulaRaw) elFormulaRaw.innerText = calcResult.formulaRaw;

    // 3. Render Calculation Steps Cards
    if (elStepsContainer) {
      elStepsContainer.innerHTML = '';
      calcResult.steps.forEach(step => {
        const stepCard = document.createElement('div');
        stepCard.className = 'crystal-btn p-3 text-left flex flex-col gap-1 transition-all';
        stepCard.innerHTML = `
          <div class="text-xs font-bold text-cyan-400 font-mono">${step.title}</div>
          <div class="text-xs font-mono text-slate-200 leading-relaxed">${step.description}</div>
        `;
        elStepsContainer.appendChild(stepCard);
      });
    }

    // 4. Update Memory Visualizers
    visualizer.renderLogicalGrid(state, activeHighlights);
  }

  /**
   * Run Operation Algorithm
   */
  function runOperation() {
    pauseAnimation();
    state.animation.currentStep = 0;
    state.animation.stepsData = [];

    const tab = state.activeTab;
    if (tab === 'calc') {
      recalculateAll();
      renderOperationLogs(['Address calculation mode active. Click any cell or RAM block to derive memory address.']);
      return;
    }

    let opResult;
    if (tab === 'linear') {
      opResult = ArrayOperations.runLinearSearch(visualizer.arrayData, state.searchValue, state);
      state.animation.stepsData = opResult.steps;
    } else if (tab === 'binary') {
      if (state.dimension !== '1D') {
        renderOperationLogs(['⚠️ Binary Search requires a 1D sorted array. Auto-switching to 1D mode.']);
        state.dimension = '1D';
        elDimension.value = '1D';
        readStateFromInputs();
        visualizer.generateSampleData(state);
      }
      visualizer.arrayData.sort((a, b) => Number(a.value) - Number(b.value));
      opResult = ArrayOperations.runBinarySearch(visualizer.arrayData, state.searchValue, state);
      state.animation.stepsData = opResult.steps;
    } else if (tab === 'insert') {
      opResult = ArrayOperations.simulateInsertion(visualizer.arrayData, state.targetIndex, state.insertValue, state);
      state.animation.stepsData = opResult.steps;
    } else if (tab === 'delete') {
      opResult = ArrayOperations.simulateDeletion(visualizer.arrayData, state.targetIndex, state);
      state.animation.stepsData = opResult.steps;
    }

    state.animation.totalSteps = state.animation.stepsData.length;
    applyAnimationStep(0);
    playAnimation();
  }

  /**
   * Apply specific step frame to visualizer
   */
  function applyAnimationStep(stepIdx) {
    if (!state.animation.stepsData || state.animation.stepsData.length === 0) return;
    stepIdx = Math.max(0, Math.min(stepIdx, state.animation.stepsData.length - 1));
    state.animation.currentStep = stepIdx;

    const frame = state.animation.stepsData[stepIdx];
    const highlights = {};

    if (frame.type === 'INSPECT') {
      highlights.inspectRow = frame.inspectRow;
      highlights.inspectCol = frame.inspectCol;
      if (frame.isMatch) {
        highlights.foundRow = frame.inspectRow;
        highlights.foundCol = frame.inspectCol;
      }
    } else if (frame.type === 'INSPECT_MID') {
      highlights.inspectRow = frame.inspectRow;
      highlights.inspectCol = frame.inspectCol;
      highlights.lowMidHigh = { low: frame.low, mid: frame.mid, high: frame.high };
      if (frame.isMatch) {
        highlights.foundRow = frame.inspectRow;
        highlights.foundCol = frame.inspectCol;
      }
    } else if (frame.type === 'SHIFT_RIGHT' || frame.type === 'SHIFT_LEFT') {
      highlights.shiftingRow = frame.fromIndex;
      highlights.shiftingCol = 0;
    } else if (frame.type === 'PLACE_VALUE') {
      highlights.insertedRow = frame.insertIndex;
      highlights.insertedCol = 0;
    }

    recalculateAll(highlights);

    const logsToDisplay = state.animation.stepsData.slice(0, stepIdx + 1).map(s => s.log);
    renderOperationLogs(logsToDisplay);

    if (elStepIndicator) {
      elStepIndicator.innerText = `Step ${stepIdx + 1} of ${state.animation.totalSteps}`;
    }
  }

  function playAnimation() {
    if (state.animation.isPlaying) return;
    if (state.animation.currentStep >= state.animation.totalSteps - 1) {
      state.animation.currentStep = 0;
    }
    state.animation.isPlaying = true;
    if (elBtnPlay) elBtnPlay.innerHTML = '<i class="fas fa-pause mr-1"></i> Pause';

    state.animation.timer = setInterval(() => {
      if (state.animation.currentStep < state.animation.totalSteps - 1) {
        applyAnimationStep(state.animation.currentStep + 1);
      } else {
        pauseAnimation();
      }
    }, state.animation.speedMs);
  }

  function pauseAnimation() {
    state.animation.isPlaying = false;
    if (state.animation.timer) {
      clearInterval(state.animation.timer);
      state.animation.timer = null;
    }
    if (elBtnPlay) elBtnPlay.innerHTML = '<i class="fas fa-play mr-1"></i> Play';
  }

  function renderOperationLogs(logsArray) {
    if (!elOperationLogs) return;
    elOperationLogs.innerHTML = '';
    logsArray.forEach(msg => {
      const logEntry = document.createElement('div');
      logEntry.className = 'text-xs font-mono py-1 px-2.5 rounded bg-black/40 text-cyan-300 border-l-2 border-cyan-400 mb-1';
      logEntry.innerText = msg;
      elOperationLogs.appendChild(logEntry);
    });
    elOperationLogs.scrollTop = elOperationLogs.scrollHeight;
  }

  // Event Listeners for Inputs
  [elDimension, elOrdering, elBaseAddress, elElementSize, elTotalRows, elTotalCols, elTargetRow, elTargetCol, elSearchValue, elInsertValue].forEach(el => {
    if (el) {
      el.addEventListener('input', () => {
        readStateFromInputs();
        if (el === elDimension || el === elTotalRows || el === elTotalCols) {
          visualizer.generateSampleData(state);
        }
        recalculateAll();
      });
    }
  });

  // View Mode Switcher Listeners
  viewModeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      applyViewMode(btn.dataset.mode);
    });
  });

  // Operation Tabs Handling
  const tabButtons = document.querySelectorAll('.op-tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('bg-cyan-500', 'text-slate-950', 'font-bold'));
      tabButtons.forEach(b => b.classList.add('text-slate-300'));

      btn.classList.remove('text-slate-300');
      btn.classList.add('bg-cyan-500', 'text-slate-950', 'font-bold');

      state.activeTab = btn.dataset.tab;
      
      if (state.activeTab === 'linear' || state.activeTab === 'binary') {
        elOpValueWrapper.classList.remove('hidden');
        document.getElementById('op-value-label').innerText = 'Search Target Value';
      } else if (state.activeTab === 'insert') {
        elOpValueWrapper.classList.remove('hidden');
        document.getElementById('op-value-label').innerText = 'Insert Value';
      } else {
        elOpValueWrapper.classList.add('hidden');
      }

      runOperation();
    });
  });

  // Stepper Controller Buttons
  if (elBtnPlay) elBtnPlay.addEventListener('click', () => state.animation.isPlaying ? pauseAnimation() : playAnimation());
  if (elBtnNext) elBtnNext.addEventListener('click', () => { pauseAnimation(); applyAnimationStep(state.animation.currentStep + 1); });
  if (elBtnPrev) elBtnPrev.addEventListener('click', () => { pauseAnimation(); applyAnimationStep(state.animation.currentStep - 1); });
  if (elBtnReset) elBtnReset.addEventListener('click', () => { pauseAnimation(); applyAnimationStep(0); });

  if (elSpeedSlider) {
    elSpeedSlider.addEventListener('input', (e) => {
      state.animation.speedMs = 2100 - Number(e.target.value);
      if (elSpeedValue) elSpeedValue.innerText = `${(state.animation.speedMs / 1000).toFixed(1)}s`;
      if (state.animation.isPlaying) {
        pauseAnimation();
        playAnimation();
      }
    });
  }

  // Presets Selector
  if (elPresetSelect) {
    elPresetSelect.addEventListener('change', (e) => {
      const preset = e.target.value;
      if (preset === '1d-int') {
        state.dimension = '1D';
        state.baseAddress = '1000';
        state.elementSize = 4;
        state.totalRows = 8;
        state.targetIndex = 3;
      } else if (preset === '2d-rmo') {
        state.dimension = '2D';
        state.ordering = 'RMO';
        state.baseAddress = '0x1000';
        state.elementSize = 4;
        state.totalRows = 4;
        state.totalCols = 4;
        state.targetRow = 2;
        state.targetCol = 1;
      } else if (preset === '2d-cmo') {
        state.dimension = '2D';
        state.ordering = 'CMO';
        state.baseAddress = '2000';
        state.elementSize = 8;
        state.totalRows = 3;
        state.totalCols = 5;
        state.targetRow = 1;
        state.targetCol = 4;
      } else if (preset === 'char-1d') {
        state.dimension = '1D';
        state.baseAddress = '5000';
        state.elementSize = 1;
        state.totalRows = 10;
        state.targetIndex = 5;
      }
      syncInputsFromState();
      visualizer.generateSampleData(state);
      recalculateAll();
    });
  }

  // Theme Dropdown Selector
  if (elThemeSelect) {
    elThemeSelect.addEventListener('change', (e) => {
      applyTheme(e.target.value);
    });
  }

  // Initial Calculation & Theme setup
  applyTheme('crystal');
  applyViewMode('all');
  recalculateAll();
  renderOperationLogs(['Liquid Crystal Simulator loaded successfully.']);
});
