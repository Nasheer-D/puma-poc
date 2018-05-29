import { JsonController, Res, Body, Post } from 'routing-controllers';
import { DataService, ISqlQuery } from '../../datasource/DataService';
import { ResponseHandler } from '../../utils/responseHandler/ResponseHandler';
import { UserBuilder } from '../../domain/users/models/User';

@JsonController('/register')
export class AuthController {
    @Post('/')
    public async registerUser(@Body() registrationDetails: IRegistrationDetails, @Res() response: any): Promise<any> {
        const userToRegister = this.assignPropertiesToBuilder(registrationDetails).build();
        const sqlQuery: ISqlQuery = {
            text: `INSERT INTO app_users("userID", "userName", email, hash, salt, credits, "registrationDate")
            VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
            values: [userToRegister.userID, userToRegister.username, userToRegister.email, userToRegister.hash,
            userToRegister.salt, userToRegister.credits, userToRegister.registrationDate]
        };

        try {
            const result = await new DataService().executeQueryAsPromise(sqlQuery);

            return new ResponseHandler().handle(response, result);
        } catch (error) {
            return new ResponseHandler().handle(response, error);
        }
    }

    private assignPropertiesToBuilder(registrationDetails: IRegistrationDetails): UserBuilder {
        const userBuilder = new UserBuilder();
        userBuilder.username = registrationDetails.username;
        userBuilder.password = registrationDetails.password;
        userBuilder.email = registrationDetails.email;

        return userBuilder;
    }
}

interface IRegistrationDetails {
    username: string;
    email: string;
    password: string;
}