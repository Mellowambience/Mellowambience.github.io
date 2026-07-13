"""Hilbert-space & linear-algebra primer (simulator-only, PennyLane 0.45).

Demonstrates the core Hilbert-space machinery behind every QI product:
  * states as vectors in a complex Hilbert space  H = C^{2^n}
  * inner product <psi|phi>, norm ||psi||, expectation <psi|H|psi>
  * unitarity  U^dagger U = I  (gates are unitary maps on H)
  * Gram-Schmidt orthonormalization -> builds an orthonormal basis of H

Sources driving this exercise:
  [1] Gill et al. 2024, "Quantum Computing: Vision and Challenges" (arXiv:2403.02240)
  [2] Magano & Murca 2022, "Simplifying a classical-quantum algorithm
      interpolation with quantum singular value transformations" (arXiv:2207.14810)
"""
import numpy as np
import pennylane as qml

dev = qml.device("default.qubit", wires=1)


@qml.qnode(dev)
def psi_circuit(theta, phi):
    """Parameterized 1-qubit state |psi> = cos(t/2)|0> + e^{i phi} sin(t/2)|1>."""
    qml.RY(theta, wires=0)
    qml.RZ(phi, wires=0)
    return qml.state()


def main():
    # --- 1. state norm & inner product in the complex Hilbert space ---
    psi = np.array(psi_circuit(0.7, 1.3), dtype=complex)
    norm = float(qml.math.real(qml.math.sqrt(qml.math.sum(qml.math.conj(psi) * psi))))
    zero = np.array([1.0, 0.0], dtype=complex)
    ip = complex(qml.math.sum(qml.math.conj(zero) * psi))  # <0|psi>
    print(f"[1] ||psi||        = {norm:.6f}  (expect 1.0)")
    print(f"    <0|psi>        = {ip.real:.4f}{ip.imag:+.4f}j")

    # --- 2. expectation value <psi|H|psi> for H = sigma_z ---
    Z = np.array([[1, 0], [0, -1]], dtype=complex)
    expZ = float(qml.math.real(
        qml.math.tensordot(qml.math.conj(psi), qml.math.matmul(Z, psi), axes=1)))
    print(f"[2] <psi|Z|psi>    = {expZ:.6f}  (expect cos(theta) = {np.cos(0.7):.6f})")

    # --- 3. unitary check: U^dagger U == I ---
    U = np.array(qml.matrix(qml.Rot(0.5, 0.3, 0.9, wires=0)), dtype=complex)
    I = np.eye(2, dtype=complex)
    unitary_resid = float(qml.math.sum(qml.math.abs(qml.math.matmul(qml.math.conj(U).T, U) - I)))
    print(f"[3] ||U^H U - I||_1 = {unitary_resid:.2e}  (expect ~0)")

    # --- 4. Gram-Schmidt: orthonormal basis extraction in R^3 ---
    vecs = [np.array([1.0, 1.0, 0.0]),
            np.array([1.0, 0.0, 1.0]),
            np.array([0.0, 1.0, 1.0])]
    basis = []
    for v in vecs:
        u = v.astype(float).copy()
        for b in basis:
            u = u - np.dot(u, b) * b
        n = np.linalg.norm(u)
        if n > 1e-9:
            basis.append(u / n)
    basis = np.array(basis)
    ortho_err = float(np.max(np.abs(basis @ basis.T - np.eye(3))))
    print(f"[4] Gram-Schmidt orthonormal error = {ortho_err:.2e}  (expect ~0)")

    ok = (abs(norm - 1) < 1e-6 and abs(expZ - np.cos(0.7)) < 1e-6
          and unitary_resid < 1e-6 and ortho_err < 1e-6)
    print(f"\nRESULT: {'PASS — Hilbert-space linear algebra verified' if ok else 'CHECK FAILED'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
