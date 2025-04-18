import { queryRecordsTool } from "../tools/query-records";
import { insertRecordTool } from "../tools/insert-record";
import { updateRecordTool } from "../tools/update-record";
import { ToolConfig } from "../types/tools";

export const tools: ToolConfig[] = [
  queryRecordsTool,
  insertRecordTool,
  updateRecordTool,
]; 