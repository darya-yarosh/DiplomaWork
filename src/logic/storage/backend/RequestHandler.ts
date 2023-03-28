/**
 * Handler of requests to api.
 */
export default class RequestHandler {
    /**
     * GET request to getting data from backend.
     * 
     * @param apiLink request link.
     * 
     * @returns data from link.
     */
    async getData(apiLink: string) {
        const response = await fetch(apiLink, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const data = await response.json();
        return data;
    }

    /**
     * POST request to creating data for backend.
     * 
     * @param apiLink request link.
     * @param data data for creating.
     */
    async createData(apiLink: string, data: object) {
        await fetch(apiLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    }

    /**
     * PUT request to updating data for backend.
     * 
     * @param apiLink request link.
     * @param data data for updating.
     * 
     * @returns result of request. true if data is updated. false if data is not updated.
     */
    async updateData(apiLink: string, data: object) {
        const response = await fetch(apiLink, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        return await response.json();
    }

    /**
     * DELETE request to removing data from backend.
     * 
     * @param apiLink request link.
     * 
     * @returns result of request. true if data is removed. false if data is not removed.
     */
    async deleteData(apiLink: string) {
        await fetch(apiLink, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }
}