import type { IActivityHandler } from "@vertigis/workflow";
import { DataGatewayService } from "../../api/DataGatewayService";
import { DataGatewayError } from "../../api/DataGatewayError";


export interface CreateDataGatewayServiceInputs {

    /**
     * @description The base URL of the VertiGIS Data Gateway API.
     * @required
     */
    baseUrl: string;

    /**
     * @description The user to authenticate with the VertiGIS Data Gateway API.
     * @required
     */

    username: string;
    /**
     * @description The password used to authenticate with the VertiGIS Data Gateway API.
     * @required
     */
    password: string;

}

export interface CreateDataGatewayServiceOutputs {

    /**
     * @description The user profile associated with the specified email address.
     */
    service: DataGatewayService;
}

/**
 * @category VertiGIS Data Gateway - Service
 * @defaultName dataGatewayService
 * @description Creates a VertiGIS Date Gateway Service for use with the Data Gateway Actvities.
 */
export default class CreateDataGatewayService implements IActivityHandler {

    async execute( inputs: CreateDataGatewayServiceInputs ): Promise<CreateDataGatewayServiceOutputs> {

        const {
            baseUrl,
            username,
            password
        } = inputs;

        if (!baseUrl) {
            throw new Error(
                "baseUrl is required"
            );
        }

        if (!username) {
            throw new Error(
                "username is required"
            );
        }

        if(!password) {
            throw new Error(
                "username is required"
            ); 
        }
        const token = await this.authenticateUser(username, password, baseUrl);


        
        return {
            service: {
                baseUrl,
                bearerToken: token,
            },
        };
    }

    private async authenticateUser(username: string, password: string, baseUrl: string ): Promise<string> {
        const url = `${baseUrl}/api/v1/auth/login`;
        
        const headers: Record<
            string,
            string
        > = {
            "Content-Type": "application/json"
        };
        const requestBody = JSON.stringify({username, password});

        try {

            const response =
                await fetch(
                    url,
                    {
                        method: "POST",
                        headers,
                        body: requestBody
                    }
                );

            if (!response.ok) {

                const error =
                    await DataGatewayError.fromResponse(
                        response
                    );

                console.error(
                    `[DataGateway] Authentication Error`,
                    error
                );

                throw error;
            }

            if (
                response.status === 204
            ) {
                return undefined;
            }

            const contentType =
                response.headers.get(
                    "content-type"
                );

            if (
                contentType?.includes(
                    "application/json"
                )
            ) {

                const responseJSON = await response.json();
                return responseJSON?.accessToken;
            }

            return undefined;
        }
        catch (error) {

            console.error(
                `[DataGateway] Request failed`
            );

            throw error;
        }
    }    
}