"""Minimal continuous-action quantum actor exercise (simulator-only).

A one-qubit VQC emits a bounded continuous action a in [-1, 1].  A tiny
analytic critic supplies a deterministic policy-gradient objective, while a
second quantum circuit applies U_a(pi*a) to the state and measures target-state
fidelity.  This mirrors the continuous-control loop in quantum DDPG without
pretending to be a full-scale replay-buffer implementation.

Sources:
  - Wu et al., Quantum 9, 1660 (2025), arXiv:2012.10711
    https://quantum-journal.org/papers/q-2025-03-12-1660
  - Zhou et al., Auxiliary Task-based Deep Reinforcement Learning for Quantum
    Control, arXiv:2302.14312
"""
import pennylane as qml
import pennylane.numpy as np


DEV = qml.device("default.qubit", wires=1, shots=None)
STATE_ANGLE = 0.37
TARGET_ACTION = 0.55
TARGET_ANGLE = STATE_ANGLE + np.pi * TARGET_ACTION


@qml.qnode(DEV, interface="autograd")
def quantum_policy(state_angle, weight):
    """VQC policy: state encoding + trainable rotation -> continuous action."""
    qml.RY(state_angle, wires=0)
    qml.RY(weight, wires=0)
    return qml.expval(qml.PauliZ(0))


@qml.qnode(DEV)
def transition_overlap(state_angle, action, target_angle):
    """Quantum environment reward signal: target-state Pauli-Z overlap."""
    qml.RY(state_angle, wires=0)
    qml.RY(np.pi * action, wires=0)  # U_a(action), continuous control
    qml.RY(-target_angle, wires=0)
    return qml.expval(qml.PauliZ(0))


def critic_value(action, desired_action):
    """Toy one-step Q critic; higher is better and action remains continuous."""
    return 1.0 - (action - desired_action) ** 2


def fidelity(action):
    """Convert the overlap into [0, 1] target-state fidelity."""
    overlap = transition_overlap(STATE_ANGLE, action, TARGET_ANGLE)
    return 0.5 * (1.0 + overlap)


def main():
    # qml.numpy is intentional: PennyLane must see a trainable parameter.
    weight = np.array(-1.10, requires_grad=True)
    optimizer = qml.AdamOptimizer(stepsize=0.15)

    def actor_loss(w):
        action = quantum_policy(STATE_ANGLE, w)
        return -critic_value(action, TARGET_ACTION)

    start_action = float(quantum_policy(STATE_ANGLE, weight))
    start_fidelity = float(fidelity(start_action))

    for step in range(80):
        weight, loss = optimizer.step_and_cost(actor_loss, weight)
        if step in (0, 19, 39, 79):
            action = float(quantum_policy(STATE_ANGLE, weight))
            print(
                f"step={step + 1:02d} action={action:+.4f} "
                f"critic={float(-loss):+.4f} fidelity={float(fidelity(action)):.4f}"
            )

    final_action = float(quantum_policy(STATE_ANGLE, weight))
    final_fidelity = float(fidelity(final_action))
    print(
        f"start_fidelity={start_fidelity:.4f} "
        f"final_fidelity={final_fidelity:.4f} "
        f"target_action={TARGET_ACTION:+.2f} final_action={final_action:+.4f}"
    )

    assert abs(final_action - TARGET_ACTION) < 0.03
    assert final_fidelity > 0.99
    print("PASS: simulator VQC learned a continuous control action.")


if __name__ == "__main__":
    main()
