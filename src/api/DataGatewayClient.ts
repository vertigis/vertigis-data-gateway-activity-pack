import {
    components,
    operations
} from "./generated/types";

import { DataGatewayService } from "./DataGatewayService";

import { DataGatewayRequest } from "./DataGatewayRequest";

type Assignment =
    components["schemas"]["AssignmentDetail"];

type Submission =
    components["schemas"]["SubmissionDetail"];

type User =
    components["schemas"]["UserProfile"];

type Supplier =
    components["schemas"]["SupplierDetail"];

type SpecificationField =
    components["schemas"]["SpecificationFieldDetail"];

type SubmissionPatch =
    components["schemas"]["SubmissionPatch"];

type AssignmentsResponse =
    components["schemas"]["AssignmentsResponse"];

type SubmissionsResponse =
    components["schemas"]["SubmissionsResponse"];

type SubmissionInputDetail =
    components["schemas"]["SubmissionInputDetail"];

type SubmissionMediaDetail =
    components["schemas"]["SubmissionMediaDetail"];

type DataStoreParameterDetail =
    components["schemas"]["DataStoreParameterDetail"];

type PatchInputParametersRequest =
    operations["patchInputParameters"]["requestBody"]["content"]["application/json"];

type PatchInputParametersResponse =
    Record<string, DataStoreParameterDetail[]>;

type GetSubmissionsQuery =
    operations["getSubmissions"]["parameters"]["query"];

type UpdateInputResponse =
    Record<string, SubmissionInputDetail>;

export class DataGatewayClient {

    private readonly api: DataGatewayRequest;

    private toQueryValue(
        value: unknown
    ): string | undefined {

        if (
            typeof value === "object" &&
            value !== null &&
            value !== undefined &&
            !(value instanceof Date)
        ) {
            return JSON.stringify(value);
        } else if (
            value === null ||
            value === undefined
        ) {
            return undefined;
        } else if (
            typeof value === "boolean"
        ) {
            return value
                ? "true"
                : "false";
        } else if (
            value instanceof Date
        ) {
            return value.toISOString();
        }

        return (value as any).toString();
    }

    constructor( service: DataGatewayService) {
        
        this.api = new DataGatewayRequest(
            service.baseUrl,
            service.bearerToken
        );
    }

    private buildQuery(
        params?: Record<string, unknown>
    ): string {

        const query = new URLSearchParams();

        for ( const [key, value] of Object.entries( params ?? {} ) ) {

            if (
                value === undefined ||
                value === null
            ) {
                continue;
            }

            if (Array.isArray(value)) {

                for (const item of value) {

                    if (
                        item !== undefined &&
                        item !== null
                    ) {
                        const serialized = this.toQueryValue(item);

                        if (serialized !== undefined) {
                            query.append(key, serialized);
                        }
                    }
                }

                continue;
            }

            const serialized = this.toQueryValue(value);

            if (serialized !== undefined) {
                query.set(key, serialized);
            }
        }

        const qs = query.toString();

        return qs
            ? `?${qs}`
            : "";
    }

    async getAssignment(
        assignmentKey: string ): Promise<Assignment> {

        return this.api.get<Assignment>(
            `/api/v1/assignments/${encodeURIComponent(
                assignmentKey
            )}`
        );
    }

    async createSubmission(
        assignmentKey: string,
        sendNotifications?: boolean,
        schemaMappingEnabled?: boolean ): Promise<Submission> {

        const qs = this.buildQuery({
            sendNotifications,
            schemaMappingEnabled
        });

        return this.api.post<Submission>(
            `/api/v1/assignments/${encodeURIComponent(
                assignmentKey
            )}/submission${qs}`
        );
    }

    async getSubmission(
        submissionReference: string ): Promise<Submission> {

        return this.api.get<Submission>(
            `/api/v1/submissions/${encodeURIComponent(
                submissionReference
            )}`
        );
    }

    async getSubmissions(
        params?: GetSubmissionsQuery ): Promise<SubmissionsResponse> {

        return this.api.get<SubmissionsResponse>(
            `/api/v1/submissions${this.buildQuery(
                params
            )}`
        );
    }

    async startSubmission(
        submissionReference: string ): Promise<Submission> {

        return this.api.post<Submission>(
            `/api/v1/submissions/${encodeURIComponent(
                submissionReference
            )}/start`
        );
    }

    async closeSubmission(
        submissionReference: string ): Promise<Submission> {

        return this.api.post<Submission>(
            `/api/v1/submissions/${encodeURIComponent(
                submissionReference
            )}/close`
        );
    }

    async cancelSubmission(
        submissionReference: string ): Promise<Submission> {

        return this.api.post<Submission>(
            `/api/v1/submissions/${encodeURIComponent(
                submissionReference
            )}/cancel`
        );
    }

    async patchSubmission(
        submissionReference: string,
        patch: SubmissionPatch ): Promise<Submission> {

        return this.api.patch<Submission>(
            `/api/v1/submissions/${encodeURIComponent(
                submissionReference
            )}`,
            patch
        );
    }

    async describeInputs(
        submissionReference: string ): Promise<
        Record<string, SubmissionInputDetail>
    > {

        return this.api.get<
            Record<string, SubmissionInputDetail>
        >(
            `/api/v1/submissions/${encodeURIComponent(
                submissionReference
            )}/inputs`
        );
    }

    async patchInputParameters(
        submissionReference: string,
        parameters: PatchInputParametersRequest ): Promise<PatchInputParametersResponse> {

        return this.api.patch<
            PatchInputParametersResponse
        >(
            `/api/v1/submissions/${encodeURIComponent(
                submissionReference
            )}/input_parameters`,
            parameters
        );
    }

    async fetchSpecificationFields(
        specificationKey: string ): Promise<SpecificationField[]> {

        return this.api.get<
            SpecificationField[]
        >(
            `/api/v1/specifications/${encodeURIComponent(
                specificationKey
            )}/fields`
        );
    }

    async getMyAssignments(
        filter?: string,
        page?: number,
        size?: number ): Promise<AssignmentsResponse> {

        return this.api.get<AssignmentsResponse>(
            `/api/v1/my_assignments${this.buildQuery({
                filter,
                page,
                size
            })}`
        );
    }

    async getUserByEmail(
        email: string ): Promise<User> {

        return this.api.get<User>(
            `/api/v1/userByEmail?email=${encodeURIComponent(
                email
            )}`
        );
    }

    async getSupplierByName(
        name: string ): Promise<Supplier> {

        return this.api.get<Supplier>(
            `/api/v1/supplierByName?name=${encodeURIComponent(
                name
            )}`
        );
    }

    async removeFileForInput(
        submissionReference: string,
        inputKey: string ): Promise<void> {

        await this.api.delete(
            `/api/v1/submissions/${encodeURIComponent(
                submissionReference
            )}/inputs/${encodeURIComponent(
                inputKey
            )}`
        );
    }

    async uploadInput(
        submissionReference: string,
        inputKey: string,
        dataStorePath: string,
        file: Blob | File ): Promise<UpdateInputResponse> {

        const formData =
            new FormData();

        formData.append(
            "file",
            file
        );

        return this.api.post<UpdateInputResponse>(
            `/api/v1/submissions/${encodeURIComponent(
                submissionReference
            )}/inputs/${encodeURIComponent(
                inputKey
            )}${this.buildQuery({
                dataStorePath
            })}`,
            formData
        );
    }

    async downloadSubmissionOutput(
        submissionReference: string,
        storedFilename: string,
        download?: string ): Promise<Blob> {

        return this.api.getBlob(
            `/api/v1/submissions/${encodeURIComponent(
                submissionReference
            )}/outputs/${encodeURIComponent(
                storedFilename
            )}${this.buildQuery({
                download
            })}`
        );
    }

    getOutputsByFormat(
        submission: Submission,
        formatName: string
    ): SubmissionMediaDetail[] {

        return Object.values(
            submission.outputs ?? {}
        ).filter(
            output =>
                output.format?.name ===
                formatName
        );
    }

    async downloadOutputFile(
        submissionReference: string,
        output: SubmissionMediaDetail ): Promise<Blob> {

        const storedFilename = output.file?.storedFilename;

        if (!storedFilename) {
            throw new Error(
                "Output file is missing storedFilename."
            );
        }

        return this.downloadSubmissionOutput(
            submissionReference,
            storedFilename,
            output.file?.filename
        );
    }

    async downloadOutputsByFormat(
        submissionReference: string,
        formatName: string ): Promise<
        {
            filename: string;
            content: Blob;
        }[]
    > {

        const submission =
            await this.getSubmission(submissionReference);

        const matchingOutputs =
            this.getOutputsByFormat(
                submission,
                formatName
            );

        return Promise.all(
            matchingOutputs.map(
                async output => {

                    const content =
                        await this.downloadOutputFile(
                            submissionReference,
                            output
                        );

                    return {
                        filename:
                            output.file?.filename ??
                            output.file?.storedFilename ??
                            "output",
                        content
                    };
                }
            )
        );
    }
}