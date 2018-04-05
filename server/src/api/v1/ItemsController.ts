import { Body, Get, JsonController, Param, Post, UseBefore, Put, Delete, Res } from 'routing-controllers';
import { Container } from 'typedi';
import { LoggerInstance } from 'winston';
import { LoggerFactory } from '../../utils/logger/LoggerFactory';
import { DataSourceConfig } from '../../datasource/config/DataSource.config';
import { DataService, IQueryMessage, ISqlQuery } from '../../datasource/DataService';
import { UserAuthenticatorMiddleware } from '../../middleware/UserAuthenticatorMiddleware';
import { Thing } from '../../domain/things/models/Thing';
import { ThingCreator } from '../../domain/things/ThingCreator';

@JsonController('/items')
export class ItemsController {
  private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('ItemsController');

  @Get('/')
  public async getAllItems(@Res() response: any): Promise<any> {
    const sqlQuery: ISqlQuery = {
      text: `SELECT * FROM items`
    };

    try {
      const result = await new DataService().executeQueryAsPromise(sqlQuery);
      if (result.success) {
        response.status(200).json(result);
      } else {
        response.status(400).json(result);
      }
    } catch (error) {
      response.status(500).json(error);
    }
  }

  @Get('/:id')
  public async getThingByID(@Param('id') thingID: string, @Res() response: any): Promise<any> {
    const sqlQuery: ISqlQuery = {
      text: `SELECT * FROM things where thingID = ?`,
      values: [thingID]
    };

    try {
      const result = await new DataService().executeQueryAsPromise(sqlQuery);
      if (result.success) {
        response.status(200).json(result);
      } else {
        response.status(400).json(result);
      }
    } catch (error) {
      response.status(500).json(error);
    }
  }

  @Post('/')
  public async addNewThing(@Body() newThingRequest: ThingRequest, @Res() response: any): Promise<any> {
    let thing: Thing = <Thing>{};
    const sqlQuery: ISqlQuery = {
      text: `INSERT INTO things (thingID, description) VALUES (?, ?)`,
      values: [thing.thingID, thing.description]
    };

    if (!newThingRequest.thingID) {
      const thingCreator = new ThingCreator();
      const thingCreatorBuilder = thingCreator.assignPropertiesToBuilder(newThingRequest);
      thing = thingCreatorBuilder.build();
    } else {
      thing = newThingRequest as Thing;
    }

    try {
      const result = await new DataService().executeUpdateAsPromise(sqlQuery, 'ADD NEW THING');
      if (result.success) {
        response.status(200).json(result);
      } else {
        response.status(400).json(result);
      }
    } catch (error) {
      response.status(500).json(error);
    }
  }

  @Put('/')
  public async updateThing(@Body() updateThingRequest: ThingRequest, @Res() response: any): Promise<any> {
    const sqlQuery = {
      text: `UPDATE things SET description = ? WHERE thingID = ?`,
      values: [updateThingRequest.description, updateThingRequest.thingID]
    };

    try {
      const result = await new DataService().executeUpdateAsPromise(sqlQuery, 'UPDATE THING');
      if (result.success) {
        response.status(200).json(result);
      } else {
        response.status(400).json(result);
      }
    } catch (error) {
      response.status(500).json(error);
    }
  }

  @Delete('/:id')
  public async deleteThing(@Param('id') thingID: string, @Res() response: any): Promise<any> {
    const deleteThingQuery = {
      text: `DELETE FROM things WHERE thingID = ?`,
      values: [thingID]
    };

    try {
      const result = await new DataService().executeUpdateAsPromise(deleteThingQuery, 'DELETE THING');
      if (result.success) {
        response.status(200).json(result);
      } else {
        response.status(400).json(result);
      }
    } catch (error) {
      response.status(500).json(error);
    }
  }
}

export interface ThingRequest {
  thingID?: string;
  description: string;
}
