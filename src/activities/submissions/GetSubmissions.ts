import type { IActivityHandler } from "@vertigis/workflow";

import {
    operations,
    components
} from "../../api/generated/types";

import { DataGatewayClient } from "../../api/DataGatewayClient";
import { DataGatewayService } from "../../api/DataGatewayService";
type GetSubmissionsQuery =
    operations["getSubmissions"]["parameters"]["query"];

type SubmissionsResponse =
    components["schemas"]["SubmissionsResponse"] | undefined;

export interface GetSubmissionsInputs {

    /**
     * @displayName Data Gateway Service
     * @description The service definition for the data gateway.
     * @required
     */
    service: DataGatewayService;

    /**
     * @description Optional submission query filters. Supports filtering by dates, assignment, specification, supplier, user, state, outcome, source, and pagination settings.
     */
    query?: GetSubmissionsQuery;
}

export interface GetSubmissionsOutputs {

    /**
     * @description The paginated list of submissions matching the specified query filters.
     */
    submissions: SubmissionsResponse;
}

/**
 * @category VertiGIS Data Gateway - Submissions
 * @defaultName submissions
 * @description Retrieves a paginated list of submissions from the VertiGIS Data Gateway using the supplied filtering and pagination criteria.
 */
export default class GetSubmissions implements IActivityHandler {

    async execute( inputs: GetSubmissionsInputs ): Promise<GetSubmissionsOutputs> {

        const { service } = inputs;

        if (!service) {
            throw new Error(
                "Gateway service is required"
            );
        }

        try {

        const client = new DataGatewayClient(service);

            return {
                submissions:
                    await client.getSubmissions(
                        inputs.query
                    )
            };
        } catch (error) {
            console.error(
                "Error occurred while retrieving submissions:",
                error
            );
            return {
                submissions: undefined
            };
        }
    }
}