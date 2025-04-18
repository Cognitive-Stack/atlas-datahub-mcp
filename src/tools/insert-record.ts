import { z } from "zod";
import { StorageService } from "../services/storage";
import { ToolConfig } from "../types/tools";



export const insertRecordTool: ToolConfig = {
  name: "insert-record",
  description: "Insert a new record into Azure Cosmos DB",
  parameters: z.object({
    id: z.string().describe("Unique identifier for the record"),
    partitionKey: z.string().describe("Partition key for the record"),
    data: z.record(z.any()).describe("Record data to be stored"),
  }),
  execute: async (args) => {
    try {
      const record = {
        id: args.id,
        partitionKey: args.partitionKey,
        data: args.data,
        timestamp: new Date().toISOString(),
      };
      const storageService = new StorageService();
      return await storageService.insertRecord(record);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to insert record: ${errorMessage}`);
    }
  },
}; 