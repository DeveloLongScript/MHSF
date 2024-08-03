class CommandEvents {
  eventTarget;

  constructor() {
    this.eventTarget = new EventTarget();
  }

  // Method to emit events
  emit(eventName: string) {
    const event = new CustomEvent(eventName);
    this.eventTarget.dispatchEvent(event);
  }

  // Method to listen for events
  on(eventName: string, callback: () => void) {
    this.eventTarget.addEventListener(eventName, () => {
      callback();
    });
  }
}

const events = new CommandEvents();
export default events;
