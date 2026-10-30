import { DataGatewayError } from "./DataGatewayError";

export class DataGatewayRequest {

    constructor(
        private readonly baseUrl: string,
        private readonly bearerToken: string
    ) { }

    async get<T>(
        path: string,
        query?: {
            filter?: string;
            page?: number;
            size?: number;
        } ): Promise<T> {

        return this.request<T>(
            "GET",
            path,
            undefined,
            query
        );
    }

    async getBlob(
        path: string,
        query?: Record<
            string,
            string | number | boolean
        > ): Promise<Blob> {

        const url = new URL(
            path,
            this.baseUrl
        );

        if (query) {
            for (
                const [key, value]
                of Object.entries(query)
            ) {
                if (value !== undefined) {
                    url.searchParams.set(
                        key,
                        String(value)
                    );
                }
            }
        }

        try {

            const response = await fetch(
                url.toString(),
                {
                    method: "GET",
                    headers: {
                        Authorization:
                            `Bearer ${this.bearerToken}`
                    }
                }
            );

            if (!response.ok) {

                const error =
                    await DataGatewayError.fromResponse(
                        response
                    );

                console.error(
                    `[DataGateway] GET ${url}`,
                    error
                );

                throw error;
            }

            return await response.blob();
        }
        catch (error) {

            console.error(
                `[DataGateway] Request failed`,
                {
                    method: "GET",
                    url: url.toString()
                }
            );

            throw error;
        }
    }

    async post<T>(
        path: string,
        body?: unknown,
        options?: {
            sendNotifications?: boolean;
            schemaMappingEnabled?: boolean;
        } ): Promise<T> {

        return this.request<T>(
            "POST",
            path,
            body,
            options
        );
    }

    async patch<T>(
        path: string,
        body?: unknown ): Promise<T> {

        return this.request<T>(
            "PATCH",
            path,
            body
        );
    }

    async delete<T>(
        path: string ): Promise<T> {

        return this.request<T>(
            "DELETE",
            path
        );
    }

    private async request<T>(
        method: string,
        path: string,
        body?: unknown,
        query?: {
            filter?: string;
            page?: number;
            size?: number;
            sendNotifications?: boolean;
            schemaMappingEnabled?: boolean;
        } ): Promise<T> {

        const url = new URL(
            path,
            this.baseUrl
        );

        if (query) {
            for (
                const [key, value]
                of Object.entries(query)
            ) {
                if (value !== undefined) {
                    url.searchParams.set(
                        key,
                        String(value)
                    );
                }
            }
        }

        const headers: Record<
            string,
            string
        > = {
            Authorization:
                `Bearer ${this.bearerToken}`
        };

        let requestBody:
            BodyInit | undefined;

        if (
            body instanceof FormData
        ) {

            requestBody = body;
        }
        else if (
            body !== undefined
        ) {

            headers["Content-Type"] =
                "application/json";

            requestBody =
                JSON.stringify(body);
        }

        try {

            const response =
                await fetch(
                    url.toString(),
                    {
                        method,
                        headers,
                        body: requestBody
                    }
                );

            if (!response.ok) {

                const error =
                    await DataGatewayError.fromResponse(
                        response
                    );

                console.error(
                    `[DataGateway] ${method} ${url}`,
                    error
                );

                throw error;
            }

            if (
                response.status === 204
            ) {
                return undefined;
            }

            const contentType =
                response.headers.get(
                    "content-type"
                );

            if (
                contentType?.includes(
                    "application/json"
                )
            ) {

                return await response.json();
            }

            return undefined;
        }
        catch (error) {

            console.error(
                `[DataGateway] Request failed`,
                {
                    method,
                    url: url.toString(),
                    body
                }
            );

            throw error;
        }
    }
}