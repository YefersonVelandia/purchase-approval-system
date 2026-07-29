export const logger = {
  info(message: string, data?: unknown) {
    console.log(
      JSON.stringify({
        level: "INFO",
        message,
        data,
        timestamp: new Date().toISOString(),
      }),
    );
  },

  error(message: string, error?: unknown) {
    console.error(
      JSON.stringify({
        level: "ERROR",
        message,
        error,
        timestamp: new Date().toISOString(),
      }),
    );
  },
};
