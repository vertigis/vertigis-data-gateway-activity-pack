export class DataGatewayError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly responseBody?: string
    ) {
        super(message);

        this.name = "DataGatewayError";
    }

    static async fromResponse(
        response: Response ): Promise<DataGatewayError> {

        const body = await response.text();

        return new DataGatewayError(
            `1Engage request failed (${response.status} ${response.statusText})`,
            response.status,
            body
        );
    }
}