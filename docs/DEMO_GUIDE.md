# QuantumShield Lab: Live Demonstration Guide
## Repeatable Walkthrough for Academic Presentations & Faculty Viva

This guide provides a structured, 6-to-8 minute live demonstration sequence designed to showcase all functional modules of QuantumShield Lab. Each step includes exact user actions, expected outcomes, and concise talking points for evaluators.

---

## 📋 Pre-Flight Checklist

Before presenting, ensure both servers are active:

> **Tip:** You can start both servers simultaneously by double-clicking **`start_servers.bat`** in the project root!

1. **Backend Server:**
   ```powershell
   python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
   ```
   *Verify:* Navigate to `http://127.0.0.1:8000/api/health` → Status must return `"ok"`.

2. **Frontend Development Server:**
   ```powershell
   cd frontend
   npm run dev
   ```
   *Verify:* Open `http://localhost:3000` in Google Chrome or Microsoft Edge.

3. **Status Indicator:**
   Confirm the top navigation bar displays a green **"API CONNECTED · Python 3.13"** badge.

---

## 🎬 Demonstration Sequence (6–8 Minutes)

### Step 1: System Overview & Threat Model (1 Minute)
* **URL:** `http://localhost:3000`
* **Action:**
  1. Point out the dark cybersecurity theme, real-time backend health monitor, and navigation sidebar.
  2. Scroll down to the **Quantum Threat Breakdown** card.
  3. Briefly contrast Shor's algorithm (exponential speedup against RSA and ECC) with Grover's algorithm (quadratic search speedup against AES, easily countered by doubling key size to 256 bits).
* **Talking Point:**
  > *"QuantumShield Lab bridges discrete mathematics theory with the newly finalized August 2024 NIST Post-Quantum Standards: ML-KEM (FIPS 203), ML-DSA (FIPS 204), and SLH-DSA (FIPS 205)."*

---

### Step 2: Discrete Mathematics Lab (2.5 Minutes)
* **URL:** `http://localhost:3000/math-lab`
* **Actions & Expected Outcomes:**

  #### 2.1 Modular Arithmetic & Number Theory (Module 1)
  - Select preset: `(17 + 12) mod 7`. Click **Calculate Modular Addition**.
    - *Expected:* Output shows `29 mod 7 = 1` with step-by-step formula.
  - Select preset: `5^3 mod 7`. Click **Calculate Exponentiation**.
    - *Expected:* Output shows `125 mod 7 = 6` with binary square-and-multiply breakdown.
  - Select preset: `GCD(35, 15) & ModInv`. Click **Run Extended Euclidean Algorithm**.
    - *Expected:* Output shows $\gcd(35, 15) = 5$, Bézout coefficients $35(1) + 15(-2) = 5$, and step trace.

  #### 2.2 Educational RSA Demonstration (Module 2)
  - Click the **RSA Demonstration** tab.
  - Click **Preset: (p=61, q=53)**.
  - Enter message: `65` (ASCII 'A'). Click **Compute RSA Roundtrip**.
    - *Expected:*
      - $n = p \times q = 3233$
      - $\phi(n) = 3120$
      - Public exponent $e = 17$
      - Modular inverse private exponent $d = 2753$
      - Encrypted ciphertext $c = 65^{17} \bmod 3233 = 2790$
      - Decrypted plaintext $m' = 2790^{2753} \bmod 3233 = 65$
  - *Talking Point:*
    > *"In RSA, security rests on the difficulty of integer factorization. Shor's algorithm finds the order $r$ in polynomial time, enabling an adversary to derive $\phi(n)$ and $d$ directly."*

  #### 2.3 Matrices & Noisy Linear Equation (Module 4)
  - Switch to **Lattices & Noise (LWE)** tab.
  - Click **Preset: Standard LWE (A=[[2,1],[1,3]], s=[1,2], e=[1,0], q=7)**.
  - Click **Compute Noisy Equation**.
    - *Expected:*
      - Matrix-vector product: $A \cdot s = [4, 7]$
      - Addition with noise vector $e$: $A \cdot s + e = [5, 7]$
      - Modular reduction: $b = [5, 0] \pmod 7$
      - The interactive 2D SVG canvas visually renders the basis vectors and grid points.
  - *Talking Point:*
    > *"Without noise ($e=0$), recovering $s$ from $b$ is trivial linear algebra. With noise ($e \neq 0$), finding $s$ is equivalent to the Closest Vector Problem (CVP) on lattices, which is computationally intractable for both classical and quantum computers."*

  #### 2.4 Cryptographic Hash Functions & Avalanche Effect (Module 5)
  - Switch to **Hash Functions** tab.
  - Input: `QuantumShield Lab FIPS 203` vs `Quantumshield Lab FIPS 203` (single lowercase 's').
  - Click **Analyze Avalanche Effect**.
    - *Expected:* Displays bit divergence chart showing ~50% bit flip across the 256 bits, proving strict avalanche criterion (SAC).

---

### Step 3: Cryptographic Workbench (2 Minutes)
* **URL:** `http://localhost:3000/crypto-workbench`
* **Actions & Expected Outcomes:**

  #### 3.1 ML-KEM Key Encapsulation (FIPS 203)
  - Under **ML-KEM** tab, select parameter set `ML-KEM-768`.
  - Click **Execute KEM Workflow**.
    - *Expected:*
      - Generates Alice $(ek, dk)$ and Bob $(c, K_B)$.
      - Decapsulates Alice $K_A$.
      - Displays **VALIDATED ✓** status confirming $K_A == K_B$.
      - Artifact sizes: Public Key = 1,184 Bytes, Ciphertext = 1,088 Bytes.
      - Displays one-way SHA-256 fingerprint: `SHA256:abc...`.
      - **Zero-Knowledge Hygiene:** Emphasize that raw private keys and shared secrets are never exposed in UI or stored.
  - Click **Save to History**.

  #### 3.2 ML-DSA Digital Signature & Anti-Tamper Test (FIPS 204)
  - Switch to **ML-DSA (FIPS 204)** tab.
  - Authentic Message: *"Authentic discrete mathematics course project payload."*
  - Modified Message (Tamper Sandbox): Change word to *"Authentic discrete mathematics course project hacked!"*
  - Click **Sign & Verify Tamper Resilience**.
    - *Expected:*
      - Authentic verification: **VALID ✓**
      - Modified message verification: **REJECTED ✗ (Original Signature Rejected for Modified Message)**
      - Artifact sizes: Public Key = 1,952 Bytes, Signature = 3,309 Bytes.
  - Click **Save to History**.

  #### 3.3 SLH-DSA Hash-Based Signatures (FIPS 205)
  - Switch to **SLH-DSA (FIPS 205)** tab.
  - Click **Sign & Verify with SLH-DSA**.
    - *Expected:*
      - Authentic verification: **VALID ✓**
      - Public Key size: **32 Bytes** (Extremely compact!).
      - Signature size: **7,856 Bytes** (Large due to Merkle hypertree authentication paths).
  - Click **Save to History**.

---

### Step 4: Controlled Benchmark Studio (1.5 Minutes)
* **URL:** `http://localhost:3000/benchmark-studio`
* **Actions & Expected Outcomes:**
  1. Select algorithm: `ML-KEM-768`.
  2. Set Repetitions: `5`, Warm-ups: `2`.
  3. Click **Run Benchmark**.
  4. Wait ~2 seconds for live measurements.
  - *Expected:*
    - **Summary Cards:** Display Overall Median latency (~2-3 ms), Min latency, Max latency, and Repetitions.
    - **Recharts Line Chart:** Visualizes timing across measured samples with dotted median line.
    - **Results Table:** Displays separate rows for:
      - Key Generation ($ek, dk$)
      - Encapsulation ($ct, K_B$)
      - Decapsulation ($dk, ct \to K_A$)
      with actual median, min, max, standard deviation, and output byte sizes.
    - **Methodology Notice:** Clearly discloses that warm-ups were excluded and results reflect local host CPU execution.
  5. Click **Save Run to Experiment History**.

---

### Step 5: Experiment History & Comparative Analysis (1 Minute)
* **URL:** `http://localhost:3000/experiment-history`
* **Actions & Expected Outcomes:**
  1. Show that all runs saved during the demo are preserved in browser `localStorage`.
  2. Click **Inspect Details** on a record to view the JSON metadata panel. Close inspector.
  3. Select **2 records** using the card checkboxes (e.g., KEM run and Benchmark run, or DSA and SLH-DSA).
  4. Notice the **Compare Selected (2)** button lights up. Click it.
     - *Expected:* The **Experiment Comparison Studio** modal opens with a side-by-side comparative table analyzing latencies, artifacts, and speedup ratios.
     - Close the modal.
  5. Click **Export CSV** → Browser downloads `quantumshield_experiments_<timestamp>.csv`.
  6. Click **Export JSON** → Downloads raw JSON archive.
  7. Click **Clear History** → The in-app confirmation modal appears asking for confirmation before deleting.

---

### Step 6: Documentation & Viva Voce Handbook (30 Seconds)
* **URL:** `http://localhost:3000/learn-docs`
* **Actions & Expected Outcomes:**
  1. Show the interactive Viva Voce accordion (8 essential oral exam questions and model answers).
  2. Point out direct clickable links to official NIST CSRC publications for FIPS 203, FIPS 204, and FIPS 205.

---

## 💡 Quick Answers to Likely Faculty Inquiries During Demo

| Faculty Question | Recommended Quick Answer |
| :--- | :--- |
| **"Are you running actual cryptography or just a simulation?"** | *"We execute genuine implementations of NIST FIPS 203 (kyber-py), FIPS 204 (dilithium-py), and FIPS 205 (slh-dsa). All key sizes, ciphertexts, and signatures match official NIST test vectors exactly."* |
| **"Where are private keys stored?"** | *"Nowhere. We practice strict zero-knowledge secret hygiene: private keys and derived shared secrets are kept strictly in ephemeral RAM on the Python backend, validated internally, and never logged or serialized to the frontend."* |
| **"Why is SLH-DSA signing slower than ML-DSA?"** | *"SLH-DSA does not rely on lattices; it uses a hypertree of Merkle trees over WOTS+ one-time signatures. Generating hundreds of cryptographic hashes per signature takes more compute, but provides a conservative fallback if lattice mathematics is ever breached."* |
