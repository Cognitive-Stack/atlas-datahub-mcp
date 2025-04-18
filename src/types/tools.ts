import { z } from "zod";
import { FastMCP } from "fastmcp";

export type ToolConfig = {
  name: string;
  description: string;
  parameters: z.ZodObject<any>;
  execute: (args: any) => Promise<string>;
};

export type Tool = FastMCP["addTool"];

export type Record = {
  id: string;
  partitionKey: string;
  data: any;
  timestamp: string;
};

export type QueryOptions = {
  partitionKey?: string;
  filter?: string;
  limit?: number;
};

export type UpdateOptions = {
  partitionKey: string;
  id: string;
  data: any;
}; 