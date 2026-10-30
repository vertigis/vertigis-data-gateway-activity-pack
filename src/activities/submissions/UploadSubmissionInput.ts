import type { IActivityHandler } from "@vertigis/workflow";
import { DataGatewayClient } from "../../api/DataGatewayClient";
import { DataGatewayService } from "../../api/DataGatewayService";

export interface UploadSubmissionInputInputs {
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
    
    /**
     * @description The input key identifying the parameter.
     * @required
     */
    inputKey: string;

    /**
     * @description The path to the server-side datastore defined by the input parameter.
     * @required
     */
    dataStorePath: string;

    /**
     * @description The file to upload as an input to the submission.
     * @required
     */    
    file: File;
}

export interface UploadSubmissionInputOutputs {
    inputs: Record<string, unknown> | undefined;
}
/**
 * @category VertiGIS Data Gateway - Submissions
 * @defaultName inputParameter
 * @description Uploads an input file to a Data Gateway submission.
 */
export default class UploadSubmissionInput implements IActivityHandler {
    public async execute( inputs: UploadSubmissionInputInputs ): Promise<UploadSubmissionInputOutputs> {
        const {
            service,
            submissionReference, 
            inputKey, 
            dataStorePath, 
            file 
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

        if (!inputKey) {
            throw new Error(
                "inputKey is required"
            );
        }

        if (!dataStorePath) {
            throw new Error(
                "dataStorePath is required"
            );
        }

        if (!file) {
            throw new Error(
                "file is required"
            );
        }

        const client = new DataGatewayClient(service);
        try {
            const result = await client.uploadInput(
                submissionReference,
                inputKey,
                dataStorePath,
                file
            );

            return {
                inputs: result
            };
        } catch (error) {
            console.error(
                "Error occurred while uploading submission input:",
                error
            );
            return {
                inputs: undefined
            };
        }
    }
}