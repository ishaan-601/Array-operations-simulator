# ⚡ Array Address & Physical RAM Simulator

A modern, interactive, and high-tech web application built to simulate **Array Memory Address Calculation**, **Physical DRAM Hardware Block Allocation**, **Insertion**, **Deletion**, **Linear Search**, and **Binary Search** for 1D and 2D arrays (Row-Major & Column-Major Order).

![Array Address Simulator](https://img.shields.io/badge/Theme-Black_%26_Neon-00f0ff?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-22272E?style=for-the-badge&logo=github&logoColor=white)

---

## ✨ Creative Features

- **📼 Hardware Physical RAM Module Visualizer**:
  - Displays a realistic DDR5 DRAM Hardware Module layout.
  - Highlights system buffers, unallocated RAM blocks, allocated array memory regions, and **locks/highlights the exact byte range blocked by the target element** (e.g. `4 Bytes: 0x040C - 0x040F`).
  - Interactive: Click any DRAM block in physical memory to instantly update inputs and recalculate logical cell addresses.

- **🎨 Professional Black & Neon Styling**:
  - Futuristic dark space background (`#050811`) with glowing neon cyan (`#00f0ff`), neon emerald (`#00ff9d`), neon purple (`#bf00ff`), and neon amber accents.
  - Glassmorphism panels with neon borders and text glows.

- **🧮 1D & 2D Array Memory Address Derivation**:
  - **1D Arrays**: Address derivation with lower bounds ($LB$).
  - **2D Arrays**: Supports both **Row-Major Order (RMO)** and **Column-Major Order (CMO)**.

- ** Full Parameter Control**:
  - Base Address ($B$) input in Decimal or Hexadecimal (`0x1000`).
  - Element Size ($W$) in bytes (1 Byte `char`, 2 Bytes `short`, 4 Bytes `int/float`, 8 Bytes `double`).
  - Total Rows ($R$) & Total Columns ($C$).
  - Target Row ($i$) & Target Column ($j$).

- **📐 Interactive Logical Grid & Memory Strip**:
  - Displays array cells in a 1D strip or 2D matrix.
  - **Clicking any cell automatically updates input parameters and recalculates memory address instantly!**

- **🔍 Algorithm & Array Operation Stepper**:
  - **Insertion**: Simulates placing an element at index $i$, shifting subsequent elements right, and updating memory maps.
  - **Deletion**: Simulates removing an element at index $i$, shifting elements left, and updating memory layout.
  - **Linear Search**: Animated step-by-step element inspection and address comparison.
  - **Binary Search**: Animated $Low$, $High$, $Mid$ index calculation, mid address computation, and range reduction on sorted arrays.
  - Animation player controls (Play, Pause, Step Next, Step Prev, Speed Slider, Execution Logs).

---

## 📐 Formulas Reference

### 1D Array Address Formula
$$\text{Address}(A[i]) = \text{Base} + (i - \text{LB}) \times W$$

### 2D Array Address Formula - Row-Major Order (RMO)
In Row-Major Order, elements are stored row by row sequentially:
$$\text{Address}(A[i][j]) = \text{Base} + [ (i - \text{LBR}) \times C + (j - \text{LBC}) ] \times W$$

### 2D Array Address Formula - Column-Major Order (CMO)
In Column-Major Order, elements are stored column by column sequentially:
$$\text{Address}(A[i][j]) = \text{Base} + [ (j - \text{LBC}) \times R + (i - \text{LBR}) ] \times W$$

---

## 📂 Project Structure

```
array-address-simulator/
├── index.html            # Main web application layout & RAM visualizer
├── css/
│   └── styles.css        # Professional Black & Neon theme, glowing borders & RAM styles
├── js/
│   ├── calculator.js     # Address calculation formulas & step breakdown engine
│   ├── operations.js     # Insertion, Deletion, Linear & Binary Search step recorders
│   ├── memory.js         # Interactive logical grid, memory strip & Physical RAM renderer
│   └── app.js            # Main application event controller & state manager
├── .gitignore            # Git ignore file
└── README.md             # Project documentation
```

---

## 🚀 How to Host on GitHub Pages

1. **Commit & Push Updates**:
   ```bash
   git add .
   git commit -m "Add Physical RAM layout visualizer and professional black & neon styling"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository **Settings** tab on GitHub.
   - Select **Pages** on the left menu.
   - Under **Build and deployment** -> **Branch**, select `main` branch and `/ (root)` folder.
   - Click **Save**.
   - Your live site will be deployed at `https://YOUR_USERNAME.github.io/array-address-simulator/`.

---

## 💻 Local Quick Start

Open `index.html` directly in any modern web browser to run locally.

---

## 📜 License
MIT License - Open Source for learning and education.
