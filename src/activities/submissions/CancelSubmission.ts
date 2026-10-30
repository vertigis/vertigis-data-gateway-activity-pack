import type { IActivityHandler } from "@vertigis/workflow";

import { DataGatewayClient } from "../../api/DataGatewayClient";
import { DataGatewayService } from "../../api/DataGatewayService";
import type {
    components
} from "../../api/generated/types";

export interface CancelSubmissionInputs {

    /**
     * @displayName Data Gateway Service
     * @description The service definition for the data gateway.
     * @required
     */
    service: DataGatewayService;

    /**
     * @description The unique reference of the submission to cancel.
     * @required
     */
    submissionReference: string;
}

export interface CancelSubmissionOutputs {

    /**
     * @description The updated submission details after the cancellation request has been processed.
     * @displayName Submission
     */
    submission: components["schemas"]["SubmissionDetail"] | undefined;
}

/**
 * @category VertiGIS Data Gateway - Submissions
 * @defaultName submission
 * @description Cancels a submission. The returned submission contains the updated state and outcome information following the cancellation.
 * @clientOnly
 * @supportedApps GWV, EXB
 */
export default class CancelSubmission implements IActivityHandler {

    async execute( inputs: CancelSubmissionInputs ): Promise<CancelSubmissionOutputs> {

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

        const client = new DataGatewayClient(service);
        try {
            return {
                submission:
                    await client.cancelSubmission(
                        submissionReference
                    )
            };
        } catch (error) {
            console.error(
                "Error occurred while cancelling submission:",
                error
            );
        }
    }
}