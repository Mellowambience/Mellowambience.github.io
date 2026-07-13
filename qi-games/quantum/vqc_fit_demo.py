"""Quantum Learning Loop — Variational Quantum Circuits (VQC) exercise.

Trains a 2-qubit VQC (angle embedding + StronglyEntanglingLayers) to approximate
f(x)=sin(x) over a small domain using gradient-based optimization, then reports
the train + test MSE and a gradient-variance sanity check (barren-plateau probe).
Simulator only — no QPU.

Sources:
  - arXiv:2507.10635  Formal Verification of Variational Quantum Circuits
  - arXiv:2503.20728  Improving Variational Quantum Circuit Optimization via ...
"""
import numpy as np
import pennylane as qml

np.random.seed(42)

N_QUBITS = 2
N_LAYERS = 3
DEV = qml.device("default.qubit", wires=N_QUBITS, shots=None)


def circuit(x, weights):
    qml.AngleEmbedding(x, wires=range(N_QUBITS))
    qml.StronglyEntanglingLayers(weights, wires=range(N_QUBITS))
    return qml.expval(qml.PauliZ(0))


qnode = qml.QNode(circuit, DEV, interface="autograd")
shape = qml.StronglyEntanglingLayers.shape(n_layers=N_LAYERS, n_wires=N_QUBITS)


def model(x, weights):
    return qnode(x, weights)


def loss_fn(weights, xs, ys):
    preds = np.array([model(np.array([v, 0.0]), weights) for v in xs])
    return np.mean((preds - ys) ** 2)


# Target: f(x) = sin(x)
xs = np.linspace(-np.pi / 2, np.pi / 2, 12)
ys = np.sin(xs)

weights = np.random.uniform(-0.1, 0.1, size=shape)
opt = qml.AdamOptimizer(stepsize=0.15)

for i in range(120):
    weights = opt.step(lambda w: loss_fn(w, xs, ys), weights)
    if i % 40 == 0 or i == 119:
        print(f"step {i:3d}  train MSE = {loss_fn(weights, xs, ys):.6f}")

# Test generalization
xt = np.linspace(-np.pi / 2, np.pi / 2, 40)
yt = np.sin(xt)
test_mse = loss_fn(weights, xt, yt)

# Barren-plateau probe: variance of gradient w.r.t. random init
def grad_var():
    w0 = np.random.uniform(-np.pi, np.pi, size=shape)
    g = qml.grad(lambda w: loss_fn(w, xs, ys))(w0)
    return float(np.var(g))

print(f"final test MSE = {test_mse:.6f}")
print(f"gradient variance (random init) = {grad_var():.6e}")
print("DONE")
