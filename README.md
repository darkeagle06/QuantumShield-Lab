# QuantumShield Lab
### A Discrete Mathematics Approach to Post-Quantum Cryptography

**QuantumShield Lab** is an interactive, web-based educational and experimental laboratory designed for college-level courses in Discrete Mathematics, Computer Science, and Information Security. It connects foundational discrete mathematics (modular arithmetic, congruences, Euclid's algorithms, linear algebra, and polynomial quotient rings) to the three newly finalized National Institute of Standards and Technology (NIST) Post-Quantum Cryptography (PQC) standards: **ML-KEM (FIPS 203)**, **ML-DSA (FIPS 204)**, and **SLH-DSA (FIPS 205)**.

---

##  Course Team & Ownership

| Member | Primary Ownership | Core Deliverables |
| :--- | :--- | :--- |
| **Shaurya** | Frontend Architecture & Coordination | Layout system, API client, Next.js routing shell, and interactive workflows |
| **Shaunak** | Math Lab & Visualizations | Modular arithmetic, matrix operations, and SVG 2D lattice LWE visualizer |
| **Soham** | Cryptographic Workflows & Adapters | ML-KEM, ML-DSA, SLH-DSA execution, anti-tamper tests, and secret hygiene |
| **Shantnu** | Benchmark Engine & Quality Assurance | Monotonic timing harness, statistical analysis, CSV export, and pytest suite |

---

##  Problem Statement & Project Objectives

### The Problem
Public-key cryptography protects global communications, banking transactions, and authenticated software updates. However, Peter Shor's 1994 quantum algorithm can solve the Integer Factorization Problem (IFP) and Discrete Logarithm Problem (DLP) in polynomial time on a sufficiently capable, fault-tolerant quantum computer, completely compromising RSA and Elliptic Curve Cryptography (ECC). 

### Project Objectives
1. **Bridge Discrete Mathematics & Cryptography:** Connect modular arithmetic, GCD, Extended Euclidean algorithm, modular inverses, prime fields, matrix transformations, and polynomial quotient rings $R_q = \mathbb{Z}_q[X]/(X^{256} + 1)$ to real-world cryptographic schemes.
2. **Textbook RSA Educational Baseline:** Demonstrate classical public-key cryptography on small educational primes ($p, q$), illustrating key generation, Euler's totient $\phi(n)$, encryption, decryption, and explaining why classical modular arithmetic is vulnerable to quantum period-finding.
3. **Genuine Standardized PQC Workflows:** Implement authentic NIST standards using pure-Python and C-interfaced libraries (`kyber-py`, `dilithium-py`, and `slhdsa`):
   - **ML-KEM (NIST FIPS 203):** Alice & Bob key encapsulation roundtrip with backend validation of derived 256-bit symmetric shared secrets.
   - **ML-DSA (NIST FIPS 204):** Module-lattice digital signatures with an interactive anti-tamper sandbox verifying that modified messages cause signature rejection.
   - **SLH-DSA (NIST FIPS 205):** Stateless hash-based digital signatures demonstrating hypertree authentication paths and public-key vs signature size tradeoffs.
4. **Controlled Micro-Benchmarking:** Measure genuine execution latencies ($\mu$s/ms) using high-resolution monotonic timers (`time.perf_counter`), exclude warm-up passes, report median, min, max, and sample counts, and display results in summary cards, timeline charts, and operation breakdown tables.
5. **Zero-Knowledge Secret Hygiene:** Guarantee that private decapsulation keys, signing keys, and plaintext shared secrets are kept strictly in ephemeral RAM and never logged or serialized to the browser.
6. **Zero-Infrastructure Client Persistence:** Store experiment history, benchmark metrics, and parameter configurations in browser `localStorage`, with CSV export, JSON export/import, and side-by-side comparison without requiring database servers.

---

##  System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           QUANTUMSHIELD LAB ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   CLIENT TIER (Next.js 16 + React 19 + Tailwind CSS)                           │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │  • Overview (Threat Model & Algorithm Cards)                            │   │
│   │  • Math Lab (5 Interactive Discrete Math Modules + SVG Lattice)        │   │
│   │  • Crypto Workbench (ML-KEM, ML-DSA, SLH-DSA Workflows + Tamper Tests)  │   │
│   │  • Benchmark Studio (Controlled Micro-benchmarks + Recharts Timeline)   │   │
│   │  • Algorithm Comparison (Parameter Matrix & Size Bar Charts)            │   │
│   │  • Experiment History (Inspection, Multi-select Compare, JSON/CSV Export)│   │
│   │  • Documentation & Viva Voce Handbook                                   │   │
│   └──────────────────────┬────────────────────────────┬─────────────────────┘   │
│                          │ HTTP REST API (port 8000)  │                         │
│                          ▼                            │                         │
│   BACKEND TIER (FastAPI + Python 3.10+)               │ Client-Side             │
│   ┌───────────────────────────────────────────────┐   │ Local Storage           │
│   │  FastAPI Endpoints (CORS, Pydantic Models)    │   │ ┌─────────────────────┐ │
│   │  ├── /api/health                              │   │ │ browser localStorage│ │
│   │  ├── /api/math/* (Modular, Matrix, RSA, LWE)  │   │ │ • Experiment Runs   │ │
│   │  ├── /api/crypto/* (KEM & Sign Workflows)     │   │ │ • Monotonic Timings │ │
│   │  └── /api/benchmarks/run                      │   │ │ • Public Artifacts  │ │
│   ├──────────────────────┬────────────────────────┤   │ │ • NO Private Keys   │ │
│   │                      ▼                        │   │ └─────────────────────┘ │
│   │  Mathematical Engines (NumPy, SymPy)          │   │                         │
│   │  • modular.py (GCD, EEA, ModInv, Exp)         │   │                         │
│   │  • matrix_ops.py (Addition, Mult, Mod-q)      │   │                         │
│   │  • lattice_demo.py (b = As + e, 2D basis)     │   │                         │
│   │  • rsa_toy.py (Toy RSA & SHA-256 Avalanche)   │   │                         │
│   ├──────────────────────┬────────────────────────┤                             │
│   │                      ▼                        │                             │
│   │  Cryptographic Engines & Adapters             │                             │
│   │  • FIPS 203: kyber-py (ML-KEM-512/768/1024)   │                             │
│   │  • FIPS 204: dilithium-py (ML-DSA-44/65/87)   │                             │
│   │  • FIPS 205: slh-dsa (SHA2/SHAKE 128s/128f)   │                             │
│   │  • benchmarks/runner.py (time.perf_counter)   │                             │
│   └───────────────────────────────────────────────┘                             │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

##  Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router, Turbopack) | 16.4.2 | Server-rendered pages & static route optimization |
| **UI Library** | React | 19.0.0 | Interactive client state & dynamic components |
| **Styling** | Tailwind CSS | 4.0 | Dark cyber-laboratory design system |
| **Charts & Graphs** | Recharts | 3.6.0 | Benchmark timeline & artifact comparison visualizers |
| **Icons** | Lucide React | 1.16.0 | Cohesive iconography |
| **Backend API** | FastAPI + Uvicorn | 0.115 / 0.34 | High-performance asynchronous REST API |
| **Validation** | Pydantic | 2.10.6 | Strict request/response schema enforcement |
| **Mathematics** | NumPy & SymPy | 2.2 / 1.13 | Vector/matrix algebra & prime number theory |
| **PQC Standards** | `kyber-py`, `dilithium-py`, `slhdsa` | 1.0.0 | Pure-Python reference implementations of FIPS 203/204/205 |
| **Testing** | pytest & pytest-asyncio | 8.4.2 | Automated unit and integration testing suite |
| **Client Storage** | browser `localStorage` | HTML5 Standard | Client-side experiment store, comparisons, & CSV export |

---

##  Installation & Startup Instructions

### 1. Prerequisites
- **Python:** 3.10 or higher (`python --version`)
- **Node.js:** v18 or higher (`node -v`, `npm -v`)
- **Windows PowerShell** or **bash** shell

###  One-Click Windows Startup (Quickest)
You can launch both servers simultaneously with a single click:
- Double-click **`start_servers.bat`** (or run `start_all.bat`):
  - Automatically starts the FastAPI Backend on `http://localhost:8000`
  - Automatically starts the Next.js Frontend on `http://localhost:3000`
  - Automatically opens `http://localhost:3000` in your default browser after launching.
- Other convenience batch scripts:
  - **`start_backend.bat`**: Launches the Python FastAPI backend on port 8000 (with virtualenv and dependency auto-detection).
  - **`start_frontend.bat`**: Launches the Next.js dev server on port 3000 (with auto `npm install` check).
  - **`stop_servers.bat`**: Immediately stops and kills any orphan processes listening on port 8000 or 3000.
  - **`run_tests.bat`**: Runs the 22 automated backend unit tests and frontend production build check with a pass/fail report.

---

### 2. Manual Backend Setup
Open a terminal in the project root:

```powershell
# 1. (Optional) Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# 2. Install backend dependencies
pip install -r requirements.txt

# 3. Start the FastAPI server
python -m uvicorn backend.app.main:app --reload --port 8000
```
- API Base URL: **`http://127.0.0.1:8000`**
- Interactive Swagger API Docs: **`http://127.0.0.1:8000/docs`**
- Health Check: **`http://127.0.0.1:8000/api/health`**

### 3. Frontend Setup
Open a second terminal in the project root:

```powershell
# 1. Navigate to frontend and install dependencies
cd frontend
npm install

# 2. Start the Next.js development server
npm run dev
```
- Web Application: **`http://localhost:3000`**

---

##  Mathematical Modules & Laboratory Features

### Module 1: Modular Arithmetic & Number Theory
- **Operations:** Modular addition, subtraction, multiplication, and binary square-and-multiply exponentiation ($a^b \pmod q$).
- **Number Theory:** Greatest Common Divisor ($\gcd(a, b)$), step-by-step Extended Euclidean Algorithm deriving Bézout coefficients, modular multiplicative inverse ($a^{-1} \pmod q$), and primality testing.
- **Example:** $17 \bmod 5 = 2$, $5^3 \bmod 7 = 6$, $(17 + 12) \bmod 7 = 1$.

### Module 2: Educational RSA Demonstration
- **Small Primes:** Select educational primes $p$ and $q$ (e.g., $p=61, q=53$).
- **Derivation:** Calculates $n = p \cdot q = 3233$, Euler's totient $\phi(n) = 3120$, public exponent $e = 17$, and private exponent $d = 2753$.
- **Roundtrip:** Encrypts plaintext $m=65 \to c=2790$, decrypts $c \to m'=65$, and explains why quantum period-finding breaks this cyclic group mechanism.

### Module 3: Vectors & Matrices over $\mathbb{Z}_q$
- **Linear Algebra:** Matrix addition, matrix multiplication, and matrix-vector multiplication with element-wise modular reduction modulo $q$.
- **Dimensions:** Supports $2 \times 2$, $3 \times 3$, and arbitrary rectangular matrices.

### Module 4: Geometric Lattices & Noisy Linear Equations (LWE)
- **LWE Model:** Computes $b = A \cdot s + e \pmod q$ for user-editable matrix $A$, secret vector $s$, noise vector $e$, and modulus $q$.
- **2D Visualizer:** Interactive SVG canvas rendering lattice basis vectors $b_1, b_2$, discrete integer grid points, and target vector displacement.
- **Pedagogical Note:** Explains that without noise ($e=0$), Gaussian elimination easily solves for $s$; with noise ($e \neq 0$), the problem is equivalent to the Closest Vector Problem (CVP) on lattices.

### Module 5: Cryptographic Hash Functions & Avalanche Effect
- **SHA-256 Engine:** Computes 256-bit message digests for user-supplied strings.
- **Avalanche Visualizer:** Analyzes two inputs differing by one character, visually charting the 256 output bits and proving the ~50% bit-divergence required by the Strict Avalanche Criterion (SAC).

---

##  Standardized Cryptographic Algorithms

| Algorithm | Standard | Category | KeyGen (ms) | Encap / Sign (ms) | Decap / Verify (ms) | Public Key | Ciphertext / Sig |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ML-KEM-768** | FIPS 203 | Level 3 | ~0.74 ms | ~0.95 ms | ~1.08 ms | 1,184 Bytes | 1,088 Bytes |
| **ML-DSA-65** | FIPS 204 | Level 3 | ~3.65 ms | ~11.20 ms | ~4.15 ms | 1,952 Bytes | 3,309 Bytes |
| **SLH-DSA-SHA2-128s** | FIPS 205 | Level 1 | ~14.20 ms | ~142.50 ms | ~8.90 ms | 32 Bytes | 7,856 Bytes |

- **ML-KEM (FIPS 203):** Operates over polynomial quotient rings $R_q = \mathbb{Z}_q[X]/(X^{256} + 1)$ with $q = 3329$. Alice and Bob establish identical 256-bit symmetric shared secrets via the Fujisaki-Okamoto transform.
- **ML-DSA (FIPS 204):** Operates over $R_q$ with $q = 8380417$ using the Fiat-Shamir with Aborts framework. Interactive tamper sandbox confirms that altering even 1 byte in the message causes verification rejection.
- **SLH-DSA (FIPS 205):** Stateless hash-based signatures using WOTS+ and XMSS hypertrees. Demonstrates compact public keys (32 bytes) at the expense of larger signatures (~7.8 KB).

---

## ⏱️ Benchmark Methodology

1. **High-Resolution Monotonic Timing:** Uses Python's `time.perf_counter()` to access the CPU hardware counter, avoiding NTP time adjustments.
2. **Warm-up Exclusion:** 2 to 3 unrecorded warm-up passes are run prior to measurement, ensuring L1/L2/L3 instruction caches are warm.
3. **Separate Operation Breakdown:** Measures KeyGen, Encapsulation/Signing, and Decapsulation/Verification independently.
4. **Statistical Rigor:** Calculates median, min, max, spread, and standard deviation across $N$ repetitions.
5. **Hardware Sensitivity Notice:** Discloses that measured latencies depend on host CPU microarchitecture, Python runtime, and parameter set.

---

## 🧪 Testing Instructions

Run the 22-test automated verification suite:

```powershell
python -m pytest backend/tests -v
```

All 22 tests execute and pass:
- Modular arithmetic (addition, subtraction, multiplication, exponentiation, GCD, Extended Euclidean, modular inverse, primality)
- Textbook RSA key derivation and roundtrip encryption/decryption
- Matrix operations (addition, multiplication, matrix-vector product, dimensional error handling)
- Noisy linear equation verification ($b = As + e \pmod 7$)
- SHA-256 hash calculation and avalanche effect
- Genuine ML-KEM-768 key encapsulation roundtrip with secret validation
- Genuine ML-DSA-65 digital signature verification and tamper detection
- Genuine SLH-DSA-SHA2-128s signature verification and tamper detection
- Benchmark engine execution, repetitions, and operation breakdown

To verify frontend compilation:
```powershell
cd frontend
npm run build
```

---

## 📑 Academic Documentation

The `docs/` folder contains complete academic presentation support materials:
- **`docs/PROJECT_REPORT.md`:** Comprehensive 13-section academic project report with abstract, mathematics, architecture, testing, benchmark tables, and NIST references.
- **`docs/DEMO_GUIDE.md`:** Step-by-step repeatable live demonstration sequence (6–8 minutes) with expected outcomes and examiner talking points.
- **`docs/VIVA_QUESTIONS.md`:** 20 in-depth viva voce questions with comprehensive model answers covering discrete mathematics, lattices, quantum algorithms, and PQC engineering.

---

##  Limitations & Future Scope

### Limitations
1. **Educational Nature:** Built for conceptual demonstration and classroom experiments; not an enterprise HSM or production key vault.
2. **Interpreted Runtime:** Uses pure-Python reference implementations (`kyber-py`, `dilithium-py`, `slhdsa`). While native C implementations (like `liboqs`) run 10x–50x faster, the relative ratios and algebraic behavior are identical.
3. **Single-User Scope:** Experiment history is persisted in browser `localStorage` for lightweight zero-database portability.

### Future Scope
- WebAssembly (Wasm) compilation of native C PQC libraries for sub-millisecond in-browser lattice polynomial multiplication.
- Educational side-channel leakage visualizer illustrating timing attack countermeasures in polynomial arithmetic.
- Integration of stateful hash-based signatures (LMS/XMSS from NIST SP 800-208).

---

##  Official Reference Links

- **NIST FIPS 203 (ML-KEM):** [https://csrc.nist.gov/pubs/fips/203/final](https://csrc.nist.gov/pubs/fips/203/final)
- **NIST FIPS 204 (ML-DSA):** [https://csrc.nist.gov/pubs/fips/204/final](https://csrc.nist.gov/pubs/fips/204/final)
- **NIST FIPS 205 (SLH-DSA):** [https://csrc.nist.gov/pubs/fips/205/final](https://csrc.nist.gov/pubs/fips/205/final)
- **Open Quantum Safe (OQS) Project:** [https://openquantumsafe.org/](https://openquantumsafe.org/)
- **FastAPI Documentation:** [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
- **Next.js Documentation:** [https://nextjs.org/docs](https://nextjs.org/docs)
