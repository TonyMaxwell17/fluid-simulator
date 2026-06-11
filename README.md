# HVAC Backflow Aerodynamics Visualization

An interactive web application for visualizing airflow behavior in HVAC systems using fundamental fluid mechanics principles, including Torricelli’s Equation and Bernoulli’s Principle.

The project allows users to modify physical parameters and instantly observe their impact on velocity, flow rate, and pressure through dynamic visualization.

---

## Overview

Heating, Ventilation, and Air Conditioning (HVAC) systems rely heavily on airflow dynamics. Understanding how pressure differences and geometric constraints affect airflow is essential for system design and optimization.

This project provides an educational and engineering-oriented visualization platform that demonstrates these relationships through real-time calculations and graphical representation.

---

## Features

* Interactive parameter input
* Torricelli Equation velocity calculation
* Flow rate estimation
* Bernoulli pressure calculation
* Dynamic airflow visualization
* Real-time result updates
* Web-based user interface

---

## Engineering Principles

### 1. Torricelli's Equation

The fluid velocity is calculated using:

[
v = \sqrt{2gh}
]

where:

* (v) = velocity (m/s)
* (g) = gravitational acceleration (m/s²)
* (h) = fluid height (m)

---

### 2. Flow Rate

The volumetric flow rate is determined by:

[
Q = A \times v
]

where:

* (Q) = flow rate (m³/s)
* (A) = cross-sectional area (m²)
* (v) = velocity (m/s)

---

### 3. Bernoulli Pressure

Pressure is approximated using:

[
P = \frac{1}{2}\rho v^2
]

where:

* (P) = dynamic pressure (Pa)
* (\rho) = fluid density (kg/m³)
* (v) = velocity (m/s)

---

## Technology Stack

### Backend

* Node.js
* Express.js

### Frontend

* EJS
* JavaScript
* HTML5
* CSS3

### Visualization

* Three.js (for aerodynamic visualization)

---

## Project Structure

```text
fluid-simulator
│
├── public/
│   ├── js/
│   ├── css/
│   └── assets/
│
├── views/
│   ├── index.ejs
│   └── result.ejs
│
├── app.js
├── package.json
└── package-lock.json
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/TonyMaxwell17/fluid-simulator.git
cd fluid-simulator
```

Install dependencies:

```bash
npm install
```

Run the application:

```bash
node app.js
```

Open in browser:

```text
http://localhost:3000
```

---

## User Workflow

1. Enter system parameters:

   * Fluid Height
   * Fluid Density
   * Gravity
   * Cross-sectional Area

2. Submit the form.

3. The system calculates:

   * Velocity
   * Flow Rate
   * Pressure

4. Results are displayed together with visualization data.

---

## Educational Applications

This project can be used for:

* HVAC engineering demonstrations
* Fluid mechanics education
* Bernoulli principle visualization
* Undergraduate engineering projects
* Interactive STEM learning

---

## Future Improvements

* Full Navier-Stokes simulation
* Real-time CFD integration
* Interactive 3D airflow particles
* Pressure contour visualization
* Multi-duct HVAC modelling
* GPU-accelerated rendering

---

## Author

Tony Maxwell

GitHub:
https://github.com/TonyMaxwell17

---

## License

This project is intended for educational and academic purposes.
