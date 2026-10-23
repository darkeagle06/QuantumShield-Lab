# QuantumShield Lab: Comprehensive Viva Voce Preparation Guide
## Discrete Mathematics, Applied Cryptography & Post-Quantum Engineering

This document contains 20 essential oral exam (viva voce) questions and comprehensive model answers designed for evaluators in college-level Discrete Mathematics and Cryptography courses.

---

### Q1: What is modular arithmetic, and why is it foundational to modern cryptography?
**Answer:**
Modular arithmetic is an arithmetic system for integers where numbers "wrap around" upon reaching a given positive integer modulus $q$. Two integers $a$ and $b$ are congruent modulo $q$ ($a \equiv b \pmod q$) if and only if their difference $(a - b)$ is divisible by $q$.

It is foundational to cryptography because:
1. **Bounded State Space:** Operations are confined to the finite ring $\mathbb{Z}_q = \{0, 1, \dots, q-1\}$, preventing integer overflow and enabling fixed-size byte representations.
2. **One-Way Functions:** While operations like modular addition, multiplication, and exponentiation are computationally efficient ($O(\log b)$ for $a^b \bmod q$), their inverses (such as computing discrete logarithms or factoring composite moduli) are computationally hard on classical computers.
3. **Algebraic Structure:** The set of integers coprime to $q$ forms a multiplicative group $\mathbb{Z}_q^\times$, allowing the construction of group-based public-key cryptosystems like RSA and Diffie-Hellman.

---

### Q2: What is the Greatest Common Divisor (GCD), and how does the Extended Euclidean Algorithm derive modular multiplicative inverses?
**Answer:**
The greatest common divisor $\gcd(a, b)$ is the largest integer dividing both $a$ and $b$. 

By Bézout's Identity, there exist integers $x$ and $y$ such that:
$$a \cdot x + b \cdot y = \gcd(a, b)$$

The standard Euclidean algorithm repeatedly divides with remainder:
$$r_{k-2} = q_k \cdot r_{k-1} + r_k$$
until the remainder is 0, where the last non-zero remainder is $\gcd(a, b)$.

The **Extended Euclidean Algorithm (EEA)** works backwards through these division equations to express the GCD as a linear combination of the original inputs. When applied to an integer $a$ and modulus $q$ where $\gcd(a, q) = 1$:
$$a \cdot x + q \cdot y = 1 \implies a \cdot x \equiv 1 \pmod q$$
Thus, the Bézout coefficient $x \pmod q$ is the modular multiplicative inverse $a^{-1} \pmod q$. If $\gcd(a, q) \neq 1$, no inverse exists because $a$ and $q$ share a common factor greater than 1.

---

### Q3: How does textbook RSA work, and why is it broken by Shor's quantum algorithm?
**Answer:**
**Textbook RSA Setup:**
1. Choose two distinct primes $p$ and $q$. Compute modulus $n = p \cdot q$ and Euler's totient $\phi(n) = (p - 1)(q - 1)$.
2. Select public exponent $e$ such that $\gcd(e, \phi(n)) = 1$.
3. Compute private exponent $d = e^{-1} \pmod{\phi(n)}$ using the Extended Euclidean Algorithm.
4. Encrypt: $c = m^e \bmod n$. Decrypt: $m = c^d \bmod n$. Correctness follows from Euler's theorem: $m^{e \cdot d} = m^{k\phi(n)+1} \equiv m \pmod n$.

**Why Shor's Algorithm Breaks RSA:**
Classical factoring algorithms (like the General Number Field Sieve) require sub-exponential time $O(\exp(c (\log n)^{1/3} (\log \log n)^{2/3}))$. 

In 1994, Peter Shor showed that a quantum computer can find the period $r$ of the function $f(x) = a^x \bmod n$ in **polynomial time** $O((\log n)^2 \log \log n)$. Since $\gcd(a^{r/2} \pm 1, n)$ yields non-trivial prime factors of $n$ with high probability when $r$ is even, a fault-tolerant quantum computer running Shor's algorithm factors $n$ and recovers private key $d$ in minutes, completely compromising RSA.

---

### Q4: What is the difference between Quantum Cryptography (QKD) and Post-Quantum Cryptography (PQC)?
**Answer:**
Evaluators frequently test this distinction:
- **Quantum Cryptography (e.g., Quantum Key Distribution / QKD):** Physical-layer hardware security that uses principles of quantum mechanics (such as the Heisenberg Uncertainty Principle and No-Cloning Theorem) to detect eavesdropping on specialized fiber-optic or laser channels (e.g., BB84 protocol). It requires physical quantum hardware and cannot run over the existing internet infrastructure.
- **Post-Quantum Cryptography (PQC):** Software-based mathematical algorithms executed entirely on conventional classical computers and transmitted over existing networks (TCP/IP, TLS). PQC algorithms rely on mathematical problems (such as lattice problems and hash function preimages) for which **neither classical nor quantum computers** have known efficient polynomial-time algorithms.

---

### Q5: What is Shor's algorithm vs Grover's algorithm, and what are their respective impacts on cryptography?
**Answer:**
- **Shor's Algorithm (1994):** Solves the Abelian Hidden Subgroup Problem in polynomial time. It provides an **exponential speedup** against problems relying on discrete logarithms and integer factorization. Impact: **Completely destroys RSA, DSA, Diffie-Hellman, ECDH, and ECDSA.**
- **Grover's Algorithm (1996):** Performs unstructured database search on $N$ items in $O(\sqrt{N})$ evaluations instead of classical $O(N)$. It provides a **quadratic speedup** (equivalent to halving the effective key length). Impact:
  - AES-128 is reduced to an effective 64-bit security level (vulnerable to nation-state supercomputers).
  - AES-256 is reduced to an effective 128-bit security level, which remains computationally intractable against any physical quantum computer.
  - SHA-256 collision resistance is unaffected (Brassard et al. showed quantum collision finding is bounded by $O(2^{n/3})$).

---

### Q6: What is a mathematical lattice, and what are the Shortest Vector Problem (SVP) and Closest Vector Problem (CVP)?
**Answer:**
A **lattice** $\Lambda \subset \mathbb{R}^m$ is a discrete additive subgroup composed of all integral linear combinations of $n$ linearly independent basis vectors $\{b_1, b_2, \dots, b_n\}$:
$$\Lambda = \left\{ \sum_{i=1}^n c_i b_i \;\middle|\; c_i \in \mathbb{Z} \right\}$$

- **Shortest Vector Problem (SVP):** Given a basis for lattice $\Lambda$, find the shortest non-zero vector $v \in \Lambda \setminus \{0\}$ minimizing Euclidean norm $\|v\|$.
- **Closest Vector Problem (CVP):** Given a basis for $\Lambda$ and an arbitrary target point $t \in \mathbb{R}^m$ not on the lattice, find the lattice vector $v \in \Lambda$ closest to $t$ (minimizing $\|v - t\|$).

While the LLL algorithm can approximate SVP/CVP in polynomial time within an exponential factor $2^{O(n)}$, exact or polynomial-factor approximations in high dimensions ($n \ge 512$) are NP-hard and remain immune to quantum speedup.

---

### Q7: Explain the Learning With Errors (LWE) problem and why noise ($e$) is mathematically necessary.
**Answer:**
In standard LWE:
$$b = A \cdot s + e \pmod q$$
where $A \in \mathbb{Z}_q^{m \times n}$ is a public matrix, $s \in \mathbb{Z}_q^n$ is a secret vector, $e \in \mathbb{Z}_q^m$ is a small error/noise vector sampled from a discrete Gaussian distribution, and $b \in \mathbb{Z}_q^m$ is the public vector.

**Why Noise is Strictly Necessary:**
- If $e = 0$ (no noise), the equation is $b = A \cdot s \pmod q$. An attacker given $(A, b)$ can solve for secret $s$ in $O(n^3)$ operations using standard **Gaussian elimination** over the finite field $\mathbb{Z}_q$.
- If $e \neq 0$ (small noise), Gaussian elimination fails because the error accumulates rapidly across row reductions, overwhelming the signal. Oded Regev (2005) proved that recovering $s$ from $(A, b)$ with noise is as hard as worst-case lattice problems (GapSVP and SIVP) across all lattices of dimension $n$.

---

### Q8: What is Module-LWE (M-LWE), and why does NIST use polynomial quotient rings instead of simple integers?
**Answer:**
Plain LWE requires storing large $m \times n$ integer matrices, resulting in public keys exceeding several megabytes—impractical for network protocols like TLS and SSH.

**Module-LWE (M-LWE)** replaces scalar integers with elements from the polynomial quotient ring:
$$R_q = \mathbb{Z}_q[X]/(X^{256} + 1)$$
where polynomials have degree at most 255 and coefficients reduced modulo $q = 3329$ (in ML-KEM). 
- In M-LWE, the public matrix $A$ has dimension $k \times k$ where entries are polynomials rather than integers (e.g., $k=3$ in ML-KEM-768).
- Polynomial multiplication modulo $X^{256} + 1$ can be computed in $O(n \log n)$ time using the **Number Theoretic Transform (NTT)**.
- This reduces public key sizes from megabytes down to ~1,184 bytes while maintaining provable hardness.

---

### Q9: What is ML-KEM (NIST FIPS 203), and what is a Key Encapsulation Mechanism?
**Answer:**
**ML-KEM (Module-Lattice Key Encapsulation Mechanism)** is the primary NIST post-quantum standard for establishing a shared secret over an untrusted channel.

A **Key Encapsulation Mechanism (KEM)** differs from general public-key encryption:
- A KEM does not encrypt arbitrary user documents directly.
- Instead, Bob uses Alice's public key $ek$ to generate both a random 256-bit symmetric shared secret $K$ and a ciphertext $c$ encapsulating $K$.
- Bob sends $c$ to Alice, who uses private key $dk$ to decapsulate $c$ and recover the identical secret $K$.
- Alice and Bob then use $K$ with high-speed symmetric ciphers (e.g., AES-256-GCM or ChaCha20-Poly1305) to encrypt their payload.

ML-KEM uses the **Fujisaki-Okamoto (FO) transform**, which converts a passively secure (IND-CPA) encryption scheme into an actively secure (IND-CCA2) KEM by re-encrypting during decapsulation to detect ciphertext tampering.

---

### Q10: What is ML-DSA (NIST FIPS 204), and how does the Fiat-Shamir with Aborts paradigm work?
**Answer:**
**ML-DSA (Module-Lattice Digital Signature Algorithm)** is the NIST standard for quantum-resistant digital signatures, based on the Module Short Integer Solution (M-SIS) and M-LWE problems over ring $R_q$ with $q = 8380417$.

It utilizes **Lyubashevsky's Fiat-Shamir with Aborts** framework:
1. **Commitment:** Signer picks random masking vector $y$ and computes $w_1 = \text{HighBits}(A \cdot y)$.
2. **Challenge:** Signer computes challenge polynomial $c = H(\mu \parallel w_1)$ where $\mu = H(\text{tr} \parallel M)$.
3. **Response:** Signer calculates candidate response $z = y + c \cdot s_1$.
4. **Rejection Sampling (Aborts):** Because $z$ depends on secret $s_1$, publishing $z$ directly could leak information about the private key over multiple signatures. If $\|z\|_\infty \ge \gamma_1 - \beta$, the signer **aborts** and restarts with fresh $y$. This ensures the distribution of published signatures is independent of the private key.
5. **Verification:** Confirms $\|z\|_\infty < \gamma_1 - \beta$ and checks that the reconstructed commitment hash matches $c$.

---

### Q11: How does QuantumShield Lab's anti-tamper test verify digital signature integrity?
**Answer:**
In digital signature schemes, signatures provide **authenticity and integrity**, not confidentiality. 
In ML-DSA, the challenge hash is computed as:
$$c = H(H(\text{tr} \parallel M) \parallel w_1)$$
When a user alters even one bit or character in message $M$ to $M'$:
1. The message digest $\mu' = H(\text{tr} \parallel M')$ changes completely due to the avalanche effect.
2. When the verifier computes $\text{HighBits}(A \cdot z - c \cdot t_1 \cdot 2^d)$ using the original signature $(c, z)$, the reconstructed challenge $c' = H(\mu' \parallel w_1')$ does not match the signature's challenge $c$.
3. Verification returns **`False / REJECTED`**, mathematically proving that the message was modified in transit.

---

### Q12: What is SLH-DSA (NIST FIPS 205), and why is it included alongside lattice algorithms?
**Answer:**
**SLH-DSA (Stateless Hash-Based Digital Signature Algorithm)**, derived from SPHINCS+, is a conservative fallback signature standard.

**Why it is included:**
Lattice-based cryptography is relatively new compared to RSA. If a breakthrough in algebraic lattice reduction weakens M-LWE or M-SIS, all lattice schemes (ML-KEM and ML-DSA) could be compromised simultaneously. 
SLH-DSA relies **exclusively on the preimage and collision resistance of standard hash functions** (SHA-256 or SHAKE-256), which are extensively studied and have no underlying algebraic group structure for quantum algorithms to exploit.

**Architectural Mechanics:**
- Uses **WOTS+** (Winternitz One-Time Signatures) at the bottom layer.
- Connects one-time keys using a multi-layered **Hypertree** of Merkle trees.
- Stateless: Can sign an unlimited number of messages without maintaining state across reboots.
- Tradeoff: Tiny public keys (32 bytes), but large signatures (~7.8 KB to 17 KB).

---

### Q13: What is the Strict Avalanche Criterion (SAC) in cryptographic hash functions?
**Answer:**
The **Strict Avalanche Criterion (SAC)**, introduced by Webster and Tavares in 1985, states that if a single input bit is complemented (flipped), each output bit must change with a probability of exactly 50% ($p = 0.5$).

In QuantumShield Lab (Math Lab Module 5), students test this by hashing two strings differing by one character:
- Input 1: `QuantumShield Lab FIPS 203`
- Input 2: `Quantumshield Lab FIPS 203`
The visual bit-divergence analyzer compares all 256 bits of the SHA-256 output digests, demonstrating ~128 altered bits (50% bit flip), proving that small input alterations produce uncorrelated pseudo-random outputs.

---

### Q14: Why does Benchmark Studio use `time.perf_counter` instead of `time.time`?
**Answer:**
- `time.time()` returns wall-clock time (system real-time clock). It can be adjusted backwards or forwards by NTP synchronization, day-light savings, or operating system time corrections, making it unsuitable for microsecond-precision benchmarks.
- `time.perf_counter()` accesses the CPU's **high-resolution monotonic hardware counter** (such as the Time Stamp Counter / TSC on x86_64). It is guaranteed never to step backward, has sub-microsecond resolution, and measures strictly elapsed CPU intervals, providing scientifically sound, reproducible micro-benchmarks.

---

### Q15: Why are warm-up passes strictly necessary in cryptographic benchmarking?
**Answer:**
When an operating system runs a function for the first time:
1. **Cold Cache Misses:** Instructions and data structures are not yet loaded into L1/L2/L3 CPU hardware caches.
2. **Dynamic Linking & Imports:** Python module lookup tables and memory allocators incur first-call overhead.
3. **OS Page Faults:** Virtual memory pages are allocated and mapped on initial access.

If the first execution is averaged into the dataset, the reported latency is artificially inflated. QuantumShield Lab executes 2–3 warm-up iterations first, strictly excludes them from reported statistics, and records only steady-state cache-warmed execution samples.

---

### Q16: Why report median latency rather than arithmetic mean?
**Answer:**
In desktop operating systems (Windows, macOS, Linux), background system processes (antivirus scans, thread context switches, interrupt service routines) cause intermittent latency spikes. 

The arithmetic mean is heavily skewed by single outlier spikes:
$$\bar{x} = \frac{1}{N} \sum_{i=1}^N x_i$$
The **median** (the 50th percentile of sorted samples) is a robust statistic with a high breakdown point ($50\%$), representing true central tendency and preventing transient OS jitter from falsifying cryptographic benchmarks.

---

### Q17: What is Zero-Knowledge Secret Hygiene, and how does QuantumShield Lab implement it?
**Answer:**
Secret hygiene is the security discipline of minimizing the lifetime, scope, and exposure of confidential cryptographic secrets.

In QuantumShield Lab:
1. Private decapsulation keys ($dk$), signature signing keys ($sk$), and raw derived symmetric secrets ($K$) are strictly generated and held in ephemeral Python function scopes.
2. Shared secrets $K_A$ and $K_B$ are validated internally on the backend via `hmac.compare_digest(K_A, K_B)`.
3. The raw 32-byte secret is **never logged, printed to stdout, serialized to JSON, or sent to the browser**.
4. The API only transmits a one-way SHA-256 digest (`SHA256:abc...`), allowing students to verify that both parties computed identical keys without exposing the plaintext key.

---

### Q18: What are the main parameter sets for ML-KEM and ML-DSA, and what do NIST Security Levels 1, 3, and 5 signify?
**Answer:**
NIST defined five post-quantum security categories based on the classical and quantum resources required to break standard symmetric algorithms:
- **Level 1 (AES-128 equivalent):** At least as hard to break as AES-128 under Grover's algorithm ($\approx 2^{143}$ classical bit operations).
- **Level 3 (AES-192 equivalent):** At least as hard to break as AES-192 ($\approx 2^{207}$ classical bit operations).
- **Level 5 (AES-256 equivalent):** At least as hard to break as AES-256 ($\approx 2^{272}$ classical bit operations).

**Standard Parameter Sets:**
- **ML-KEM:**
  - `ML-KEM-512` (Matrix rank $k=2$, Level 1)
  - `ML-KEM-768` (Matrix rank $k=3$, Level 3 · **Recommended Default**)
  - `ML-KEM-1024` (Matrix rank $k=4$, Level 5)
- **ML-DSA:**
  - `ML-DSA-44` (Matrix rank $4 \times 4$, Level 2)
  - `ML-DSA-65` (Matrix rank $6 \times 5$, Level 3 · **Recommended Default**)
  - `ML-DSA-87` (Matrix rank $8 \times 7$, Level 5)

---

### Q19: Why can an adversary "Harvest Now, Decrypt Later" (HNDL), and why must we migrate before quantum computers exist?
**Answer:**
Adversaries and nation-state intelligence agencies currently intercept and store encrypted TLS sessions, government transmissions, medical records, and intellectual property. 

Even though they cannot decrypt this traffic today, once a fault-tolerant quantum computer running Shor's algorithm becomes operational in 5 to 15 years, they can decrypt the recorded historical traffic. 
By **Mosca's Theorem**:
$$\text{If } X + Y > Z$$
where $X$ is the data shelf-life requirement (e.g. 20 years for defense secrets), $Y$ is the system migration time (e.g. 5–10 years to replace all enterprise PKI), and $Z$ is the time until quantum computers arrive, then security is already compromised. Hence, post-quantum key establishment must be deployed today.

---

### Q20: What did your team build, and what did you learn from this project?
**Answer:**
We built an end-to-end educational and experimental platform connecting discrete mathematics to post-quantum cryptography:
1. **Mathematical Engine:** Dynamic modular arithmetic, GCD, Extended Euclidean algorithm, modular inverses, prime tests, and an interactive 2D geometric SVG lattice visualizer illustrating the LWE problem ($b = As + e \pmod q$).
2. **Textbook RSA Baseline:** Interactive demonstration showing classical key derivation and why order-finding compromises composite moduli.
3. **Genuine Standardized Cryptography:** Pure-Python and C-interfaced implementations of NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), and FIPS 205 (SLH-DSA) with zero-knowledge secret hygiene.
4. **Controlled Benchmark Studio:** High-resolution monotonic timing harness separating KeyGen, Encapsulation/Signing, and Decapsulation/Verification with warm-up exclusion.
5. **Experiment History:** Browser `localStorage` store supporting side-by-side comparative analysis, JSON archive, and CSV export without database infrastructure.

We learned how abstract rings like $R_q = \mathbb{Z}_q[X]/(X^{256} + 1)$ enable efficient post-quantum cryptography, the engineering tradeoffs between key sizes and signature sizes, and how to build secure, transparent software without leaking sensitive keys.
