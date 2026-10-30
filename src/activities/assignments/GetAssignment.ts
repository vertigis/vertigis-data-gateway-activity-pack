import type { IActivityHandler } from "@vertigis/workflow";
import type {
    components
} from "../../api/generated/types";

import { DataGatewayClient } from "../../api/DataGatewayClient";
import { DataGatewayService } from "../../api/DataGatewayService";

type Assignment =
    components["schemas"]["AssignmentDetail"];

export interface GetAssignmentInputs {

    /**
     * @displayName Data Gateway Service
     * @description The service definition for the data gateway.
     * @required
     */
    service: DataGatewayService;

    /**
     * @description The unique identifier of the assignment to retrieve.
     * @required
     */
    assignmentKey: string;
}

export interface GetAssignmentOutputs {

    /**
     * @description The assignment details returned by the Data Gateway.
     */
    assignment: Assignment | undefined;
}

/**
 * @category VertiGIS Data Gateway - Assignments
 * @defaultName assignment
 * @description Retrieves the details of an assignment from the VertiGIS Data Gateway using its assignment key.
 * @clientOnly
 * @supportedApps GWV, EXB
 */
export default class GetAssignment implements IActivityHandler {

    async execute( inputs: GetAssignmentInputs ): Promise<GetAssignmentOutputs> {

        const {
            service,
            assignmentKey
        } = inputs;

        if (!service) {
            throw new Error(
                "Gateway service is required"
            );
        }

        if (!assignmentKey) {
            throw new Error(
                "assignmentKey is required"
            );
        }
        try {
            const client = new DataGatewayClient(service);

            const assignment =
                await client.getAssignment(
                    assignmentKey
                );

            return {
                assignment: assignment,
            };
        } catch (error) {
            console.error(
                "Error occurred while fetching assignment:",
                error
            );
            return {
                assignment: undefined
            };
        }
    }
}