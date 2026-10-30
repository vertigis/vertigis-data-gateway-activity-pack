import type { IActivityHandler } from "@vertigis/workflow";

import {

    components,
    operations
} from "../../api/generated/types";

import { DataGatewayClient } from "../../api/DataGatewayClient";
import { DataGatewayService } from "../../api/DataGatewayService";
type Request =
    operations["patchInputParameters"]["requestBody"]["content"]["application/json"];

type Response =
    Record<
        string,
        components["schemas"]["DataStoreParameterDetail"][]
    >;

export interface PatchInputParametersInputs {

    /**
     * @displayName Data Gateway Service
     * @description The service definition for the data gateway.
     * @required
     */
    service: DataGatewayService;

    /**
     * @description The unique reference of the submission whose input parameters should be updated.
     * @required
     */
    submissionReference: string;

    /**
     * @description Input parameter values keyed by data store path and parameter name. Existing values are replaced or inserted as required.
     * @required
     */
    parameters: Request;
}

export interface PatchInputParametersOutputs {

    /**
     * @description The merged input parameter values for the submission, grouped by data store path.
     */
    parameters: Response | undefined;
}

/**
 * @category VertiGIS Data Gateway - Submissions
 * @defaultName parameters
 * @description Replaces or inserts input parameter values for a submission and returns the updated parameter configuration.
 * @clientOnly
 * @supportedApps GWV, EXB
 */
export default class PatchInputParameters implements IActivityHandler {

    async execute( inputs: PatchInputParametersInputs ): Promise<PatchInputParametersOutputs> {

        const {
            service,
            submissionReference,
            parameters
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

        if (!parameters) {
            throw new Error(
                "parameters is required"
            );
        }

        try {
            const client = new DataGatewayClient(service);

            return {
                parameters:
                    await client.patchInputParameters(
                        submissionReference,
                        parameters
                    )
            };
        } catch (error) {
            console.error(
                "Error occurred while patching input parameters:",
                error
            );
            return {
                parameters: undefined
            };
        }
    }
}