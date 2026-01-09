import toast from "react-hot-toast";

const baseStyle = {
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "15px",
    fontWeight: 500,
    maxWidth: "500px",
};

export const showSuccess = (message: string) =>
    toast.success(message, {
        style: {
            ...baseStyle,
            background: "#6b8e23",
            color: "white",
        },
        iconTheme: {
            primary: "white",
            secondary: "#6b8e23",
        },
        duration: 4000,
    });

export const showError = (message: string) =>
    toast.error(message, {
        style: {
            ...baseStyle,
            background: "#b22222",
            color: "white",
        },
        iconTheme: {
            primary: "white",
            secondary: "#b22222",
        },
        duration: 5000,
    });

export const showWarning = (message: string) =>
    toast(message, {
        icon: "⚠️",
        style: {
            ...baseStyle,
            background: "#daa520",
            color: "white",
        },
        duration: 4000,
    });

export const showInfo = (message: string) =>
    toast(message, {
        icon: "ℹ️",
        style: {
            ...baseStyle,
            background: "#4682b4",
            color: "white",
        },
        duration: 4000,
    });

export const showLoading = (message: string) =>
    toast.loading(message, {
        style: {
            ...baseStyle,
            background: "#d4a574",
            color: "white",
        },
    });

export const dismissToast = (toastId: string) => {
    toast.dismiss(toastId);
};

export const showPromise = <T,>(
    promise: Promise<T>,
    messages: {
        loading: string;
        success: string;
        error: string;
    }
) => {
    return toast.promise(
        promise,
        {
            loading: messages.loading,
            success: messages.success,
            error: messages.error,
        },
        {
            style: baseStyle,
            success: {
                style: {
                    background: "#6b8e23",
                    color: "white",
                },
                iconTheme: {
                    primary: "white",
                    secondary: "#6b8e23",
                },
            },
            error: {
                style: {
                    background: "#b22222",
                    color: "white",
                },
                iconTheme: {
                    primary: "white",
                    secondary: "#b22222",
                },
            },
            loading: {
                style: {
                    background: "#d4a574",
                    color: "white",
                },
            },
        }
    );
};