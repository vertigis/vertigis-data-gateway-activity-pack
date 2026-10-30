import type { IActivityHandler } from "@vertigis/workflow";

import { DataGatewayClient } from "../../api/DataGatewayClient";
import { DataGatewayService } from "../../api/DataGatewayService";
import type {
    components
} from "../../api/generated/types";

export interface CloseSubmissionInputs {

    /**
     * @displayName Data Gateway Service
     * @description The service definition for the data gateway.
     * @required
     */
    service: DataGatewayService;

    /**
     * @description The unique reference of the submission to close.
     * @required
     */
    submissionReference: string;
}

export interface CloseSubmissionOutputs {

    /**
     * @description The updated submission details after the submission has been closed.
     */
    submission: components["schemas"]["SubmissionDetail"] | undefined;
}

/**
 * @category VertiGIS Data Gateway - Submissions
 * @defaultName submission
 * @description Closes a finished submission. The returned submission contains the updated state, outcome, and closure information.
 * @clientOnly
 * @supportedApps GWV, EXB
 */
export default class CloseSubmission implements IActivityHandler {

    async execute( inputs: CloseSubmissionInputs ): Promise<CloseSubmissionOutputs> {

        const {
            service,
            submissionReference
        } = inputs;

        if (!service) {
            throw new Error(
                "Gateway service is required"
            );
        }

        if (!submissionReference) {
            throw new Error(
                "submissionReference is required"
            );
        }
        try {
            const client = new DataGatewayClient(service);

            return {
                submission:
                    await client.closeSubmission(
                        submissionReference
                    )
            };
        } catch (error) {
            console.error(
                "Error occurred while closing submission:",
                error
            );
            return {
                submission: undefined
            };
        }
    }
}