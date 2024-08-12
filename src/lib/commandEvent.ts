class CommandEvents {
  eventTarget;

  constructor() {
    this.eventTarget = new EventTarget();
  }

  // Method to emit events
  emit(eventName: string, info?: any) {
    const event = new CustomEvent(eventName, { detail: info });
    this.eventTarget.dispatchEvent(event);
  }

  // Method to listen for events
  on(eventName: string, callback: (info?: any) => void) {
    this.eventTarget.addEventListener(eventName, (infoF?: any) => {
      callback(infoF.detail);
    });
  }
}

const events = new CommandEvents();
export default events;
