export const windowPreventDefault = (
  eventName: keyof WindowEventMap
) => {
  window.removeEventListener(eventName, _preventDefault);

  window.addEventListener(eventName, _preventDefault, {
    passive: false
  });
};

const _preventDefault = (e: Event) => {
  e.preventDefault();
};
