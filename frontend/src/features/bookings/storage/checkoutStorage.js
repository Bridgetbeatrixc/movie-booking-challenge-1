const checkoutStorageKey = "beatrixCheckout";

export function saveCheckout(checkout) {
  localStorage.setItem(checkoutStorageKey, JSON.stringify(checkout));
}

export function loadCheckout() {
  try {
    return JSON.parse(localStorage.getItem(checkoutStorageKey));
  } catch {
    return null;
  }
}

export function clearCheckout() {
  localStorage.removeItem(checkoutStorageKey);
}
