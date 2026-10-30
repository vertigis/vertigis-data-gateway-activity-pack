import type { IActivityHandler } from "@vertigis/workflow";

import { DataGatewayClient } from "../../api/DataGatewayClient";
import { DataGatewayService } from "../../api/DataGatewayService";

export interface DownloadSubmissionOutputInputs {

    /**
     * @displayName Data Gateway Service
     * @description The service definition for the data gateway.
     * @required
     */
    service: DataGatewayService;

    /**
     * @description The unique reference of the submission containing the output.
     * @required
     */
    submissionReference: string;

    /**
     * @displayname Stored Filename
     * @description: The name of the file to be downloaded.
     */
    storedFilename?: string;

    /**
     * @displayName Output Format Name
     * @description The format name of the output to download.
     * Examples include "GeoJSON", "File Geodatabase", and "ESRI Shape (GDAL)".
     */
    formatName?: string;
}


export interface DownloadSubmissionOutputOutputs {

    /**
     * @description The filename of the downloaded output.
     */
    filename?: string;

    /**
     * @description The downloaded output file content.
     */
    content?: Blob;
}

/**
 * @category Data Gateway - Submissions
 * @defaultName submissionOutput
 * @description Downloads an output file from a Data Gateway submission by matching the specified output format name.
 * @clientOnly
 * @supportedApps GWV, EXB
 */
export default class DownloadSubmissionOutput implements IActivityHandler {

    /**
     * Downloads the first submission output matching the specified format name.
     *
     * @param inputs Activity inputs.
     * @returns Downloaded file information.
     */
    async execute( inputs: DownloadSubmissionOutputInputs ): Promise<DownloadSubmissionOutputOutputs> {

        const {
            service,
            submissionReference,
            storedFilename,
            formatName
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

        if (!formatName && !storedFilename) {
            throw new Error(
                "Either formatName or storedFilename are required"
            );
        }

        try {

        const client = new DataGatewayClient(service);

            // Retrieve submission details.
            const submission =
                await client.getSubmission(
                    submissionReference
                );
            let fileNameParam = storedFilename;
            let output = undefined;

            if (fileNameParam) {

                output =
                    Object.values(
                        submission.outputs ?? {}
                    ).find(
                        x =>
                            x.file?.storedFilename
                    );

                if (!output) {
                    throw new Error(
                        `No output found for stored file name '${storedFilename}'.`
                    );
                }

            } else {

                // Find the first output matching the requested format.
                output =
                    Object.values(
                        submission.outputs ?? {}
                    ).find(
                        x =>
                            x.format?.name ===
                            formatName
                    );

                if (!output) {
                    throw new Error(
                        `No output found for format '${formatName}'.`
                    );
                }

                fileNameParam =
                    output.file?.storedFilename;

                if (!fileNameParam) {
                    throw new Error(
                        `Output '${formatName}' is missing a stored filename.`
                    );
                }
            }




            // Download the output file.
            const content =
                await client.downloadSubmissionOutput(
                    submissionReference,
                    fileNameParam,
                    output.file?.filename
                );

            return {
                filename:
                    output.file?.filename ??
                    storedFilename,
                content
            };
        }
        catch (error) {

            console.error(
                "Error occurred while downloading submission output:",
                error
            );

            return {
                filename: undefined,
                content: undefined
            };
        }
    }
}