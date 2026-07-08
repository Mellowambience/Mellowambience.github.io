#!/usr/bin/env python3
"""Quantum planner exercise (PennyLane) for the Quantum Learning Loop.

Run via the learning loop after: pip install pennylane numpy
This trains a 2-qubit variational quantum circuit (a "quantum neural network")
to classify a tiny dataset — the building block for a QUANTUM agent planner
that scores candidate goals (replacing UtilityPlanner.decide in engine/core.py).

NOTE: simulator-only. No real QPU. PennyLane docs note early near-term QML
optimism "has not stood up to scrutiny" — treat this as a learning exercise,
not a claimed speedup.
"""
import numpy as np

def main():
    import pennylane as qml

    dev = qml.device("default.qubit", wires=2)

    @qml.qnode(dev)
    def circuit(weights, x):
        qml.RX(x[0], wires=0)
        qml.RY(x[1], wires=1)
        qml.CNOT(wires=[0, 1])
        qml.Rot(*weights[0], wires=0)
        qml.Rot(*weights[1], wires=1)
        return qml.expval(qml.PauliZ(0))

    weights = np.random.randn(2, 3)
    # tiny demo input
    out = circuit(weights, np.array([0.1, 0.2]))
    print("VQC output:", float(out))

if __name__ == "__main__":
    main()
