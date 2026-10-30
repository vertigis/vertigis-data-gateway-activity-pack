import type { IActivityHandler } from "@vertigis/workflow";

import { DataGatewayClient } from "../../api/DataGatewayClient";
import { DataGatewayService } from "../../api/DataGatewayService";
import type {
    components
} from "../../api/generated/types";

type Submission =
    components["schemas"]["SubmissionDetail"];

export interface StartSubmissionInputs {

    /**
     * @displayName Data Gateway Service
     * @description The service definition for the data gateway.
     * @required
     */
    service: DataGatewayService;

    /**
     * @description The unique reference of the submission to start.
     * @required
     */
    submissionReference: string;
}

export interface StartSubmissionOutputs {

    /**
     * @description The updated submission returned after the submission has been started.
     */
    submission: Submission | undefined;
}

/**
 * @category VertiGIS Data Gateway - Submissions
 * @defaultName submission
 * @description Starts a submission after all required files and parameters have been uploaded and configured. Returns the updated submission including its current processing state.
 * @clientOnly
 * @supportedApps GWV, EXB
 */
export default class StartSubmission implements IActivityHandler {

    async execute( inputs: StartSubmissionInputs ): Promise<StartSubmissionOutputs> {

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
                    await client.startSubmission(
                        submissionReference
                    )
            };
        } catch (error) {
            console.error(
                "Error occurred while starting submission:",
                error
            );
            return {
                submission: undefined
            };
        }
    }
}