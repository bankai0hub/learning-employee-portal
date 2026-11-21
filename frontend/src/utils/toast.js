let toastListener = null;

export const setToastListener = (listener) => {
    toastListener = listener;
};

export const showToast = (message, type = "success") => {
    if (toastListener) {
        toastListener({ message, type, id: Date.now() });
    }
};
