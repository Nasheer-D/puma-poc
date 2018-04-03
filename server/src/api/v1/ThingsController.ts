import { Body, Get, JsonController, Param, Post, UseBefore, Put, Delete, Res } from 'routing-controllers';
import { MySQLSource } from '../../datasource/MySQLSource';
import { DataSourceConfig } from '../../datasource/config/DataSource.config';
import { DataService, QueryMessage } from '../../datasource/DataService';
import { UserAuthenticatorMiddleware } from '../../middleware/UserAuthenticatorMiddleware';
import { Thing } from '../../domain/things/models/Thing';
import { ThingCreator } from '../../domain/things/ThingCreator';

@JsonController('/things')
@UseBefore(UserAuthenticatorMiddleware)
export class PurchasesController {
  @Get('/')
  public async getAllThings(@Res() response: any): Promise<any> {
    const connection = new MySQLSource(DataSourceConfig.configuration).poolConnection;
    const sqlQuery = `SELECT * FROM things`;

    try {
      const result = await new DataService(connection).executeQueryAsPromise(sqlQuery);

      if (result.success) {
        response.status(200).json(result);
      } else {
        response.status(400).json(result);
      }
    } catch (error) {
      response.status(500).json({
        success: false,
        message: 'Server error occurred.'
      });
    }
  }

  @Get('/:id')
  public async getThingByID(@Param('id') thingID: string, @Res() response: any): Promise<any> {
    const connection = new MySQLSource(DataSourceConfig.configuration).poolConnection;
    const sqlQuery = `SELECT * FROM things where thingID = ?`;

    try {
      const result = await new DataService(connection).executeQueryAsPromise(sqlQuery, [thingID]);
      if (result.success) {
        response.status(200).json(result);
      } else {
        response.status(400).json(result);
      }
    } catch (error) {
      response.status(500).json({
        success: false,
        message: 'Server error occurred.'
      });
    }
  }

  @Post('/')
  public async addNewThing(@Body() newThingRequest: ThingRequest, @Res() response: any): Promise<any> {
    let thing: Thing = <Thing>{};
    const connection = new MySQLSource(DataSourceConfig.configuration).poolConnection;
    const sqlQuery = `INSERT INTO things (thingID, description) VALUES (?, ?)`;

    if (!newThingRequest.thingID) {
      const thingCreator = new ThingCreator();
      const thingCreatorBuilder = thingCreator.assignPropertiesToBuilder(newThingRequest);
      thing = thingCreatorBuilder.build();
    } else {
      thing = newThingRequest as Thing;
    }

    try {
      const result = await new DataService(connection).executeUpdateAsPromise(sqlQuery, 'ADD NEW THING',
      [thing.thingID, thing.description]);

      if (result.success) {
        response.status(200).json(result);
      } else {
        response.status(400).json(result);
      }
    } catch (error) {
      response.status(500).json({
        success: false,
        message: 'Server error occurred.'
      });
    }
  }

  @Put('/')
  public async updateThing(@Body() updateThingRequest: ThingRequest, @Res() response: any): Promise<any> {
    const connection = new MySQLSource(DataSourceConfig.configuration).poolConnection;
    const sqlQuery = `UPDATE things SET description = ? WHERE thingID = ?`;

    try {
      const result = await new DataService(connection).executeUpdateAsPromise(sqlQuery, 'UPDATE THING',
      [updateThingRequest.description, updateThingRequest.thingID]);

      if (result.success) {
        response.status(200).json(result);
      } else {
        response.status(400).json(result);
      }
    } catch (error) {
      response.status(500).json({
        success: false,
        message: 'Server error occurred.'
      });
    }
  }

  @Delete('/:id')
  public async deleteThing(@Param('id') thingID: string, @Res() response: any): Promise<any> {
    const connection = new MySQLSource(DataSourceConfig.configuration).poolConnection;
    const deleteThingQuery = `DELETE FROM things WHERE thingID = ?`;

    try {
      const result = await new DataService(connection).executeUpdateAsPromise(deleteThingQuery, 'DELETE THING', [thingID]);

      if (result.success) {
        response.status(200).json(result);
      } else {
        response.status(400).json(result);
      }
    } catch (error) {
      response.status(500).json({
        success: false,
        message: 'Server error occurred.'
      });
    }
  }
}

export interface ThingRequest {
  thingID?: string;
  description: string;
}
