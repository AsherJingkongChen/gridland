export const windowPreventDefault = (
  eventName: keyof WindowEventMap
) => {
  windowNotPreventDefault(eventName);
  window.addEventListener(eventName, _preventDefault, {
    passive: false
  });
};

export const windowNotPreventDefault = (
  eventName: keyof WindowEventMap
) => {
  window.removeEventListener(eventName, _preventDefault);
};

const _preventDefault = (e: Event) => {
  e.preventDefault();
};
