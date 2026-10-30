import type { IActivityHandler } from "@vertigis/workflow";

import { DataGatewayClient } from "../../api/DataGatewayClient";
import { DataGatewayService } from "../../api/DataGatewayService";
import type {
    components
} from "../../api/generated/types";

type Submission =
    components["schemas"]["SubmissionDetail"];

export interface GetSubmissionInputs {

    /**
     * @displayName Data Gateway Service
     * @description The service definition for the data gateway.
     * @required
     */
    service: DataGatewayService;

    /**
     * @description The unique reference of the submission to retrieve.
     * @required
     */
    submissionReference: string;
}

export interface GetSubmissionOutputs {

    /**
     * @description The submission details returned by the Data Gateway.
     */
    submission: Submission | undefined;
}

/**
 * @category VertiGIS Data Gateway - Submissions
 * @defaultName submission
 * @description Retrieves the details of a submission from the VertiGIS Data Gateway using its submission reference.
 * @clientOnly
 * @supportedApps GWV, EXB
 */
export default class GetSubmission implements IActivityHandler {

    async execute( inputs: GetSubmissionInputs ): Promise<GetSubmissionOutputs> {

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
                    await client.getSubmission(
                        submissionReference
                    )
            };
        } catch (error) {
            console.error(
                "Error occurred while retrieving submission:",
                error
            );
            return {
                submission: undefined
            };
        }
    }
}