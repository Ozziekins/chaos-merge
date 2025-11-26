export const env = {
    port: Number(process.env.PORT ?? process.env.API_PORT ?? 4000),
    uploadsDir: "apps/api/uploads",
    publicDir: "apps/api/public"
  };
  