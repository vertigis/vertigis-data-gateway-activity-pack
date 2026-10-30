import type { IActivityHandler } from "@vertigis/workflow";

import { DataGatewayClient } from "../../api/DataGatewayClient";
import { DataGatewayService } from "../../api/DataGatewayService";
import type {
    components
} from "../../api/generated/types";

type Submission =
    components["schemas"]["SubmissionDetail"];

export interface CreateSubmissionInputs {

    /**
     * @displayName Data Gateway Service
     * @description The service definition for the data gateway.
     * @required
     */
    service: DataGatewayService;

    /**
     * @description The unique identifier of the assignment for which a submission will be created.
     * @required
     */
    assignmentKey: string;

    /**
     * @description Indicates whether notification emails should be sent when the submission requires attention. If not specified, the project default setting will be used.
     */
    sendNotifications?: boolean;

    /**
     * @displayName Enable Schema Mapping
     * @description Indicates whether schema mapping should be enabled for the new submission.
     */
    schemaMappingEnabled?: boolean;
}

export interface CreateSubmissionOutputs {

    /**
     * @description The newly created submission.
     */
    submission: Submission | undefined;
}

/**
 * @category VertiGIS Data Gateway - Submissions
 * @defaultName submission
 * @description Creates a new submission for an assignment and returns the submission details.
 * @clientOnly
 * @supportedApps GWV, EXB
 */
export default class CreateSubmission implements IActivityHandler {

    async execute( inputs: CreateSubmissionInputs ): Promise<CreateSubmissionOutputs> {

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

            const submission =
                await client.createSubmission(
                    assignmentKey,
                    inputs.sendNotifications,
                    inputs.schemaMappingEnabled
                );

            return {
                submission
            };
        } catch (error) {
            console.error(
                "Error occurred while creating submission:",
                error
            );
            return {
                submission: undefined
            };
        }
    }
}