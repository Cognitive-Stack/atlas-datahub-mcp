import { z } from "zod";
import { StorageService } from "../services/storage";
import { ToolConfig } from "../types/tools";

export const updateRecordTool: ToolConfig = {
  name: "update-record",
  description: "Update an existing record in Azure Cosmos DB",
  parameters: z.object({
    id: z.string().describe("ID of the record to update"),
    partitionKey: z.string().describe("Partition key of the record"),
    data: z.record(z.any()).describe("Updated data for the record"),
  }),
  execute: async (args) => {
    try {
      const storageService = new StorageService();
      return await storageService.updateRecord({
        id: args.id,
        partitionKey: args.partitionKey,
        data: args.data,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update record: ${errorMessage}`);
    }
  },
}; 