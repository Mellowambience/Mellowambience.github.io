"""Quantum kernel SVM exercise (PennyLane, default.qubit simulator).

Builds a quantum feature map (angle embedding + entangling layer),
computes the kernel matrix K_ij = |<phi(x_i)|phi(x_j)>|^2, and trains
a scikit-learn SVC with precomputed kernel on a 2D moons dataset.

Sources:
 - PennyLane demo "Kernel-based training of quantum models with scikit-learn"
 - Schuld et al., "Supervised quantum machine learning models are kernel
   methods", arXiv:2101.11020
"""
import numpy as np
import pennylane as qml
from sklearn.svm import SVC
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

N_QUBITS = 2
DEV = qml.device("default.qubit", wires=N_QUBITS)


def feature_map(x):
    """Angle embedding + a trainable entangling layer."""
    qml.AngleEmbedding(x, wires=range(N_QUBITS))
    qml.IsingZZ(0.5, wires=[0, 1])
    qml.RY(0.3, wires=0)
    qml.RY(0.3, wires=1)


@qml.qnode(DEV)
def kernel_circ(x1, x2):
    """Overlap circuit: |<phi(x1)|phi(x2)>|^2 via SWAP test."""
    qml.AngleEmbedding(x1, wires=range(N_QUBITS))
    qml.adjoint(qml.AngleEmbedding)(x2, wires=range(N_QUBITS))
    return qml.probs(wires=range(N_QUBITS))


def kernel(x1, x2):
    return kernel_circ(x1, x2)[0]  # |<phi(x1)|phi(x2)>|^2 = overlap prob


def main():
    X, y = make_moons(n_samples=120, noise=0.2, random_state=0)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=0
    )

    # Build training gram matrix
    K_train = np.array([[kernel(a, b) for b in X_train] for a in X_train])
    # Build test-vs-train gram matrix
    K_test = np.array([[kernel(a, b) for b in X_train] for a in X_test])

    svc = SVC(kernel="precomputed")
    svc.fit(K_train, y_train)
    pred = svc.predict(K_test)
    acc = accuracy_score(y_test, pred)
    print(f"Quantum kernel SVM test accuracy: {acc:.3f}")
    print("Done.")


if __name__ == "__main__":
    main()
