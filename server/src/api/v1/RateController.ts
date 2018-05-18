import { Get, Res, JsonController } from 'routing-controllers';
import { ResponseHandler, IResponseMessage } from '../../utils/responseHandler/ResponseHandler';
import { RateHelpers} from '../../utils/rateHelpers/RateHelper';

@JsonController('/rate')
export class RateController {
    @Get('/')
    public async getRate(@Res() response: any): Promise<any> {
        const result: IResponseMessage =  {
            success: true,
            status: 'OK',
            message: 'PMA Rate returned succesfully',
            data: [
                {
                    rate: new RateHelpers().getRate()
                }
            ]
        };

        return new ResponseHandler().handle(response, result);
    }
}