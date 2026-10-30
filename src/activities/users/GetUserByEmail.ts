import type { IActivityHandler } from "@vertigis/workflow";

import { DataGatewayClient } from "../../api/DataGatewayClient";
import { DataGatewayService } from "../../api/DataGatewayService";
import type {
    components
} from "../../api/generated/types";

type User =
    components["schemas"]["UserProfile"];

export interface GetUserByEmailInputs {

    /**
     * @displayName Data Gateway Service
     * @description The service definition for the data gateway.
     * @required
     */
    service: DataGatewayService;

    /**
     * @description The email address of the user to retrieve.
     * @required
     */
    email: string;
}

export interface GetUserByEmailOutputs {

    /**
     * @description The user profile associated with the specified email address.
     */
    user: User | undefined;
}

/**
 * @category VertiGIS Data Gateway - Users
 * @defaultName user
 * @description Retrieves a user profile from the VertiGIS Data Gateway using an email address.
 * @clientOnly
 * @supportedApps GWV, EXB
 */
export default class GetUserByEmail implements IActivityHandler {

    async execute( inputs: GetUserByEmailInputs ): Promise<GetUserByEmailOutputs> {

         const {
            service,
            email
        } = inputs;

        if (!service) {
            throw new Error(
                "Gateway service is required"
            );
        }


        if (!email) {
            throw new Error(
                "email is required"
            );
        }
        try {
            const client = new DataGatewayClient(service);

            return {
                user:
                    await client.getUserByEmail(
                        email
                    )
            };
        } catch (error) {
            console.error(
                "Error occurred while retrieving user by email:",
                error
            );
            return {
                user: undefined
            };
        }
    }
}