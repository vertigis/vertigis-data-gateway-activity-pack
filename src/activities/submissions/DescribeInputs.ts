import type { IActivityHandler } from "@vertigis/workflow";

import { DataGatewayClient } from "../../api/DataGatewayClient";
import { DataGatewayService } from "../../api/DataGatewayService";
import type {
    components
} from "../../api/generated/types";

type SubmissionInputDetail =
    components["schemas"]["SubmissionInputDetail"] | undefined;

export interface DescribeInputsInputs {

    /**
     * @displayName Data Gateway Service
     * @description The service definition for the data gateway.
     * @required
     */
    service: DataGatewayService;

    /**
     * @description The unique reference of the submission whose inputs should be described.
     * @required
     */
    submissionReference: string;
}

export interface DescribeInputsOutputs {

    /**
     * @description The available submission inputs keyed by input identifier. Each input includes metadata such as display name, selected data store, supported upload options, and configuration details.
     */
    inputs: Record<
        string,
        SubmissionInputDetail
    > | undefined;
}

/**
 * @category VertiGIS Data Gateway - Submissions
 * @defaultName inputs
 * @description Retrieves the available inputs for a submission, including upload requirements, data store configuration, and input metadata.
 * @clientOnly
 * @supportedApps GWV, EXB
 */
export default class DescribeInputs implements IActivityHandler {

    async execute( inputs: DescribeInputsInputs ): Promise<DescribeInputsOutputs> {

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
            inputs:
                await client.describeInputs(
                    submissionReference
                )
        };
        } catch (error) {
            console.error(
                "Error occurred while describing inputs:",
                error
            );
            return {
                inputs: undefined,
            };
        }
    }
}