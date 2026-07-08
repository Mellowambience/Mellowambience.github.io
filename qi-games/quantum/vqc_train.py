#!/usr/bin/env python3
"""Variational quantum circuit training exercise (PennyLane, simulator-only).

Trains a layered VQC to approximate a target function y = sin(x) over a small
dataset using gradient descent. Builds the intuition behind how a parametric
quantum circuit maps data -> trainable weights -> expectation value, which is
the exact scaffold needed to replace UtilityPlanner.decide in engine/core.py
with a quantum utility scorer.

No real QPU. PennyLane's own docs warn near-term VQC advantage claims
"have not stood up to scrutiny" - this is a learning exercise, not a speedup.
"""
import numpy as np


def main():
    import pennylane as qml
    import pennylane.numpy as pnp

    n_wires = 2
    n_layers = 2
    dev = qml.device("default.qubit", wires=n_wires)

    def ansatz(weights, x):
        qml.RX(x, wires=0)
        qml.RY(x, wires=1)
        for l in range(n_layers):
            for w in range(n_wires):
                qml.Rot(weights[l, w, 0], weights[l, w, 1], weights[l, w, 2], wires=w)
            qml.CNOT(wires=[0, 1])

    @qml.qnode(dev)
    def circuit(weights, x):
        ansatz(weights, x)
        return qml.expval(qml.PauliZ(0))

    xs = np.linspace(-1, 1, 8)
    ys = np.sin(xs)

    rng = np.random.default_rng(0)
    weights = pnp.array(rng.normal(scale=0.1, size=(n_layers, n_wires, 3)))

    def cost(weights):
        preds = pnp.array([circuit(weights, float(x)) for x in xs])
        return pnp.mean((preds - ys) ** 2)

    opt = qml.GradientDescentOptimizer(stepsize=0.3)
    for _ in range(100):
        weights = opt.step(cost, weights)

    final = float(cost(weights))
    print(f"VQC trained. final MSE = {final:.4f}")
    print("OK - clean exit")


if __name__ == "__main__":
    main()
