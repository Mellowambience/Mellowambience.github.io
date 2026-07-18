"""Small VQC simulator exercise: fit a one-qubit expectation value."""
from pathlib import Path
import json

import pennylane as qml
from pennylane import numpy as np

TARGET = 0.65

dev = qml.device("default.qubit", wires=1)

@qml.qnode(dev)
def circuit(theta):
    qml.RY(theta, wires=0)
    return qml.expval(qml.PauliZ(0))


def loss(theta):
    return (circuit(theta) - TARGET) ** 2


def main():
    theta = np.array(0.2, requires_grad=True)
    opt = qml.GradientDescentOptimizer(stepsize=0.4)
    initial = float(circuit(theta))
    for _ in range(80):
        theta = opt.step(loss, theta)
    prediction = float(circuit(theta))
    result = {
        "target": TARGET,
        "initial_expectation": initial,
        "final_expectation": prediction,
        "theta": float(theta),
        "absolute_error": abs(prediction - TARGET),
        "simulator": "PennyLane default.qubit",
    }
    out = Path(__file__).with_name("vqc_result.json")
    out.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, sort_keys=True))
    assert result["absolute_error"] < 1e-3


if __name__ == "__main__":
    main()
