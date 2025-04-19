"use strict";

import { z } from "zod";
import { StorageService } from "../services/storage";
import { ToolConfig } from "../types/tools";

export const queryRecordsTool: ToolConfig = {
  name: "query-records",
  description: "Query records from Azure Cosmos DB based on partition key and optional filters",
  parameters: z.object({
    partitionKey: z.string().describe("The partition key to query records for"),
    filter: z.string().optional().describe("Optional filter expression"),
    limit: z.number().optional().describe("Maximum number of records to return"),
  }),
  execute: async (args) => {
    try {
      const storageService = new StorageService();
      const records = await storageService.queryRecords({
        partitionKey: args.partitionKey,
        filter: args.filter,
        limit: args.limit,
      });
      return JSON.stringify(records);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to query records: ${errorMessage}`);
    }
  },
}; 