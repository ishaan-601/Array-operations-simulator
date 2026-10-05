# 💎 Array Address & Physical RAM Simulator (Liquid Crystal Edition)

A modern, interactive, and high-tech web application built to simulate **Array Memory Address Calculation**, **Physical DRAM Hardware Block Allocation**, **Insertion**, **Deletion**, **Linear Search**, and **Binary Search** for 1D and 2D arrays (Row-Major & Column-Major Order).

![Theme](https://img.shields.io/badge/Theme-iOS_Liquid_Crystal-00f0ff?style=for-the-badge&logo=apple)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-22272E?style=for-the-badge&logo=github&logoColor=white)

---

## ✨ Key Features

- **💎 iOS Liquid Crystal & Multi-Theme Engine**:
  - Frosted glass panels (`backdrop-filter: blur(24px)`), glossy surface reflections, translucent glass borders, and 3D tactile press physics (`active:scale-95`).
  - **Multi-Theme Switcher**:
    - 💎 **Liquid Crystal (iOS Glass)**
    - ⚡ **Cyberpunk Black & Neon**
    - 🌙 **Midnight Obsidian**
    - ☀️ **Light Frost Glass**

- **📱 View Mode Toolbar**:
  - Switch between visual modes on demand:
    - 📱 **All Views**: Logical Grid + Hardware RAM + Byte Strip
    - 🧮 **Logical Matrix Only**
    - 📼 **Hardware RAM Module Only**
    - 🔬 **Contiguous Byte Strip Only**

- **📼 Hardware Physical RAM Module Visualizer**:
  - Displays a realistic DDR5 DRAM Hardware Module layout.
  - Highlights system buffers, unallocated RAM blocks, allocated array memory regions, and **locks/highlights the exact byte range blocked by the target element** (e.g. `BLOCKED: 4 Bytes 0x03E8 - 0x03EB`).
  - Interactive: Click any DRAM block in physical memory to instantly update inputs and recalculate logical cell addresses.

- **🧮 1D & 2D Array Memory Address Derivation**:
  - **1D Arrays**: Address derivation with lower bounds ($LB$).
  - **2D Arrays**: Supports both **Row-Major Order (RMO)** and **Column-Major Order (CMO)**.

- ** Full Parameter Control**:
  - Base Address ($B$) input in Decimal or Hexadecimal (`0x1000`).
  - Element Size ($W$) in bytes (1 Byte `char`, 2 Bytes `short`, 4 Bytes `int/float`, 8 Bytes `double`).
  - Total Rows ($R$) & Total Columns ($C$).
  - Target Row ($i$) & Target Column ($j$).

- **🔍 Algorithm & Array Operation Stepper**:
  - **Insertion**: Simulates placing an element at index $i$, shifting elements right, and updating memory maps.
  - **Deletion**: Simulates removing an element at index $i$, shifting elements left, and updating memory layout.
  - **Linear Search**: Animated step-by-step element inspection and address comparison.
  - **Binary Search**: Animated $Low$, $High$, $Mid$ index calculation, mid address computation, and range reduction.

---

## 📐 Formulas Reference

### 1D Array Address Formula
$$\text{Address}(A[i]) = \text{Base} + (i - \text{LB}) \times W$$

### 2D Array Address Formula - Row-Major Order (RMO)
$$\text{Address}(A[i][j]) = \text{Base} + [ (i - \text{LBR}) \times C + (j - \text{LBC}) ] \times W$$

### 2D Array Address Formula - Column-Major Order (CMO)
$$\text{Address}(A[i][j]) = \text{Base} + [ (j - \text{LBC}) \times R + (i - \text{LBR}) ] \times W$$

---

## 📂 Project Structure

```
array-address-simulator/
├── index.html            # iOS Liquid Crystal layout, theme & view mode toolbars
├── css/
│   └── styles.css        # iOS glass frosted styling, crystal buttons, 4 themes
├── js/
│   ├── calculator.js     # Address calculation formulas & step breakdown engine
│   ├── operations.js     # Insertion, Deletion, Linear & Binary Search step recorders
│   ├── memory.js         # Interactive logical grid, memory strip & Physical RAM renderer
│   └── app.js            # Main controller, multi-theme & view mode engine
├── .gitignore            # Git ignore file
└── README.md             # Project documentation
```

---

## 🚀 How to Host on GitHub Pages

```bash
git add .
git commit -m "Add iOS Liquid Crystal glass theme, multi-theme engine and view mode toolbar"
git push origin main
```

Enable GitHub Pages under **Settings** $\rightarrow$ **Pages** selecting `main` branch.

---

## 📜 License
MIT License - Open Source for learning and education.
