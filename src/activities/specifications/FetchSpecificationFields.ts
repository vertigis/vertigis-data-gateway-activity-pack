import type { IActivityHandler } from "@vertigis/workflow";

import { DataGatewayClient } from "../../api/DataGatewayClient";
import { DataGatewayService } from "../../api/DataGatewayService";
import type {
    components
} from "../../api/generated/types";

type SpecificationField =
    components["schemas"]["SpecificationFieldDetail"] | undefined;

export interface FetchSpecificationFieldsInputs {

    /**
     * @displayName Data Gateway Service
     * @description The service definition for the data gateway.
     * @required
     */
    service: DataGatewayService;

    /**
     * @description The unique identifier of the specification whose fields should be retrieved.
     * @required
     */
    specificationKey: string;
}

export interface FetchSpecificationFieldsOutputs {

    /**
     * @description The metadata fields configured for the specified specification.
     */
    fields: SpecificationField[];
}

/**
 * @category VertiGIS Data Gateway - Specifications
 * @defaultName fields
 * @description Retrieves the metadata field definitions for a specification. The returned fields can be used to determine available submission metadata and field requirements.
 */
export default class FetchSpecificationFields implements IActivityHandler {

    async execute( inputs: FetchSpecificationFieldsInputs ): Promise<FetchSpecificationFieldsOutputs> {

        const {
            service,
            specificationKey
        } = inputs;

        if (!service) {
            throw new Error(
                "Gateway service is required"
            );
        }

        if (!specificationKey) {
            throw new Error(
                "specificationKey is required"
            );
        }

        try {

        const client = new DataGatewayClient(service);

            return {
                fields:
                    await client.fetchSpecificationFields(
                        specificationKey
                    )
            };
        } catch (error) {
            console.error(
                "Error occurred while fetching specification fields:",
                error
            );
            return {
                fields: [],
            };
        }
    }
}