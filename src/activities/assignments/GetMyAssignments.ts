import type { IActivityHandler } from "@vertigis/workflow";

import { DataGatewayClient } from "../../api/DataGatewayClient";
import { DataGatewayService } from "../../api/DataGatewayService";
import type {
    components
} from "../../api/generated/types";

type AssignmentsResponse =
    components["schemas"]["AssignmentsResponse"];

export interface GetMyAssignmentsInputs {

   /**
     * @displayName Data Gateway Service
     * @description The service definition for the data gateway.
     * @required
     */
    service: DataGatewayService;

    /**
     * @description Optional filter applied to assignment reference,
     * specification name, or project name.
     */
    filter?: string;

    /**
     * @displayName Page Index
     * @description The zero-based page index to retrieve.
     */
    page?: number;

    /**
     * @displayName Page Size
     * @description The number of assignments to return per page.
     */
    size?: number;
}

export interface GetMyAssignmentsOutputs {

    /**
     * @description The paginated assignments returned by the Data Gateway.
     */
    assignments: AssignmentsResponse | undefined;
}

/**
 * @category VertiGIS Data Gateway - Assignments
 * @defaultName assignments
 * @description Retrieves a paginated list of assignments available to the authenticated user.
 * @clientOnly
 * @supportedApps GWV, EXB
 */
export default class GetMyAssignments implements IActivityHandler {

    async execute( inputs: GetMyAssignmentsInputs ): Promise<GetMyAssignmentsOutputs> {

        const { service } = inputs;

        if (!service) {
            throw new Error(
                "Gateway service is required"
            );
        }

        try {
            const client = new DataGatewayClient(service);

            return {
                assignments:
                    await client.getMyAssignments(
                        inputs.filter,
                        inputs.page,
                        inputs.size
                    )
            };
        } catch (error) {
            console.error(
                "Error occurred while fetching my assignments:",
                error
            );
            return {
                assignments: undefined
            };
        }
    }
}