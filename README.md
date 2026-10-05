# 🧮 Array Address & Algorithm Visualizer

A modern, interactive, and responsive web application built to simulate **Array Memory Address Calculation**, **Insertion**, **Deletion**, **Linear Search**, and **Binary Search** for 1D and 2D arrays (Row-Major & Column-Major Order).

![Array Address Simulator](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-22272E?style=for-the-badge&logo=github&logoColor=white)

---

## ✨ Features

- **1D & 2D Array Memory Address Derivation**:
  - **1D Arrays**: Address derivation with custom lower bounds ($LB$).
  - **2D Arrays**: Supports both **Row-Major Order (RMO)** and **Column-Major Order (CMO)**.
- **Full Parameter Control**:
  - Base Address ($B$) input in Decimal or Hexadecimal (`0x1000`).
  - Element Size ($W$) in bytes (1 Byte `char`, 2 Bytes `short`, 4 Bytes `int/float`, 8 Bytes `double`).
  - Total Rows ($R$) & Total Columns ($C$).
  - Target Row ($i$) & Target Column ($j$).
- **Interactive Logical Grid**:
  - Displays array cells in a 1D strip or 2D matrix.
  - **Clicking any cell automatically updates input parameters and recalculates memory address instantly!**
- **Physical Contiguous Byte Memory Strip**:
  - Visualizes exact byte ranges (`Byte 1000..1003`) and hexadecimal memory addresses (`0x03E8`).
- **Step-by-Step Calculation Panel**:
  - Formula rendering.
  - Step 1: Identify parameters.
  - Step 2: Compute preceding element count / relative index offset.
  - Step 3: Compute byte offset ($Offset \times W$).
  - Step 4: Final memory address addition ($Base + Byte\_Offset$) in Hexadecimal and Decimal.
- **Algorithm & Array Operation Stepper**:
  - **Insertion**: Simulates placing an element at index $i$, shifting subsequent elements right, and updating memory maps.
  - **Deletion**: Simulates removing an element at index $i$, shifting elements left, and updating memory layout.
  - **Linear Search**: Animated step-by-step element inspection and address comparison.
  - **Binary Search**: Animated $Low$, $High$, $Mid$ index calculation, mid address computation, and range reduction on sorted arrays.
  - Animation player controls (Play, Pause, Step Next, Step Prev, Speed Slider, Execution Logs).
- **Modern Responsive Design**:
  - Dark / Light Mode theme toggle.
  - Quick load presets for common array types.

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
├── index.html            # Main web application layout
├── css/
│   └── styles.css        # Custom styles, animations, theme variables & cell highlights
├── js/
│   ├── calculator.js     # Address calculation formulas & step breakdown engine
│   ├── operations.js     # Insertion, Deletion, Linear & Binary Search step recorders
│   ├── memory.js         # Interactive logical grid & memory strip renderer
│   └── app.js            # Main application event controller & state manager
├── .gitignore            # Git ignore file
└── README.md             # Project documentation
```

---

## 🚀 How to Host on GitHub Pages

1. **Initialize Git Repository & Commit**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Array Address & Algorithm Visualizer"
   ```

2. **Create a GitHub Repository**:
   - Go to [GitHub New Repository](https://github.com/new).
   - Name your repository (e.g. `array-address-simulator`).
   - Keep it Public.

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/array-address-simulator.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**:
   - Go to your repository **Settings** tab.
   - Select **Pages** on the left menu.
   - Under **Build and deployment** -> **Branch**, select `main` branch and `/ (root)` folder.
   - Click **Save**.
   - Your live site will be deployed at `https://YOUR_USERNAME.github.io/array-address-simulator/`.

---

## 💻 Local Quick Start

To view the application locally without any dependencies or servers:

1. Clone or download this repository.
2. Open `index.html` directly in any modern web browser (Chrome, Firefox, Edge, Safari).

---

## 📜 License
MIT License - Open Source for learning and education.
