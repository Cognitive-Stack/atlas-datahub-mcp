import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  AZURE_COSMOS_CONNECTION_STRING: z.string(),
  AZURE_COSMOS_DATABASE_NAME: z.string(),
  AZURE_COSMOS_CONTAINER_NAME: z.string(),
  TRANSPORT_TYPE: z.enum(["stdio", "sse"]).default("stdio"),
  PORT: z.string().default("8080"),
});

export const getConfig = () => {
  const config = envSchema.safeParse(process.env);
  
  if (!config.success) {
    throw new Error(`Configuration error: ${config.error.message}`);
  }

  return config.data;
}; 