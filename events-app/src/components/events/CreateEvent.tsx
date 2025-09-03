import Modal from "../common/Modal";
import CreateEventForm from "./CreateEventForm";

export default function CreateEvent() {
  return (
    <Modal>
      <Modal.Open opens="create-event">
        <button>Create event</button>
      </Modal.Open>
      <Modal.Window name="create-event">
        <CreateEventForm />
      </Modal.Window>
    </Modal>
  );
}
