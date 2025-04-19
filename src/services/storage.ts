"use strict";

import { CosmosClient, Container } from "@azure/cosmos";
import { getConfig } from "../config/env";
import { Record, QueryOptions, UpdateOptions } from "../types/tools";

export class StorageService {
  private cosmosContainer: Container;
  private config: ReturnType<typeof getConfig>;

  constructor() {
    this.config = getConfig();
    
    // Initialize Cosmos DB client
    try {
      const cosmosClient = new CosmosClient(this.config.AZURE_COSMOS_CONNECTION_STRING);
      const database = cosmosClient.database(this.config.AZURE_COSMOS_DATABASE_NAME);
      this.cosmosContainer = database.container(this.config.AZURE_COSMOS_CONTAINER_NAME);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to initialize Cosmos DB client: ${errorMessage}`);
    }
  }

  async queryRecords(options: QueryOptions): Promise<Record[]> {
    try {
      if (options.partitionKey) {
        const query = `SELECT * FROM c WHERE c.partitionKey = '${options.partitionKey}'`;
        const { resources } = await this.cosmosContainer.items
          .query(query)
          .fetchAll();
        return resources as Record[];
      }
      return [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to query records: ${errorMessage}`);
    }
  }

  async insertRecord(record: Record): Promise<string> {
    try {
      await this.cosmosContainer.items.create(record);
      return `Record ${record.id} inserted successfully`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to insert record: ${errorMessage}`);
    }
  }

  async updateRecord(options: UpdateOptions): Promise<string> {
    try {
      const { resource } = await this.cosmosContainer.item(options.id, options.partitionKey).read();
      if (!resource) {
        throw new Error(`Record ${options.id} not found`);
      }

      const updatedRecord = {
        ...resource,
        ...options.data,
        id: options.id,
        partitionKey: options.partitionKey,
      };

      await this.cosmosContainer.items.upsert(updatedRecord);
      return `Record ${options.id} updated successfully`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update record: ${errorMessage}`);
    }
  }
} 