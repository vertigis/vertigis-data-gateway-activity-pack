import type { IActivityHandler } from "@vertigis/workflow";

import {
    components
} from "../../api/generated/types";

import { DataGatewayClient } from "../../api/DataGatewayClient";
import { DataGatewayService } from "../../api/DataGatewayService";
type SubmissionPatch =
    components["schemas"]["SubmissionPatch"];

export interface PatchSubmissionInputs {

    /**
     * @displayName Data Gateway Service
     * @description The service definition for the data gateway.
     * @required
     */
    service: DataGatewayService;

    /**
     * @description The unique reference of the submission to update.
     * @required
     */
    submissionReference: string;

    /**
     * @description The submission updates to apply. Supported values include automation mode, notification settings, and submission field values.
     * @required
     */
    patch: SubmissionPatch;
}

export interface PatchSubmissionOutputs {

    /**
     * @description The updated submission details returned by the Data Gateway.
     */
    submission: components["schemas"]["SubmissionDetail"] | undefined;
}

/**
 * @category VertiGIS Data Gateway - Submissions
 * @defaultName submission
 * @description Updates a submission's configuration and metadata. This  can be used to modify automation settings, notification preferences, and submission field values.
 * @clientOnly
 * @supportedApps GWV, EXB
 */
export default class PatchSubmission implements IActivityHandler {

    async execute( inputs: PatchSubmissionInputs ): Promise<PatchSubmissionOutputs> {

        const {
            service,
            submissionReference,
            patch
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

        if (!patch) {
            throw new Error(
                "patch is required"
            );
        }
        try {
            const client = new DataGatewayClient(service);

            return {
                submission:
                    await client.patchSubmission(
                        submissionReference,
                        patch
                    )
            };
        } catch (error) {
            console.error(
                "Error occurred while patching submission:",
                error
            );
            return {
                submission: undefined
            };
        }
    }
}