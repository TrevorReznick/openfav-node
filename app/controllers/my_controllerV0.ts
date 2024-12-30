import { Request, Response as ExpressResponse } from 'express';
import { GradioClientLite } from 'gradio-client-lite';
import fetch, { Response as FetchResponse } from 'node-fetch';

interface GradioImageResponse {
    path: string;
    url: string;
}

interface GradioConfig {
    spaceId: `${string}/${string}`;
    baseUrl: string;
    maxRetries: number;
    maxWaitTime: number;
}

class GradioController {

    private config: GradioConfig;

    constructor(config: GradioConfig) {
        this.config = {
            spaceId: config.spaceId,
            baseUrl: config.baseUrl,
            maxRetries: config.maxRetries || 5,
            maxWaitTime: config.maxWaitTime || 10000
        };
    }

    private async connectToGradio(): Promise<GradioClientLite> {
        try {
            return await GradioClientLite.connect(this.config.spaceId);
        } catch (error) {
            console.error('Failed to connect to Gradio:', error);
            throw new Error('Failed to initialize Gradio client');
        }
    }

    private async predictImage(client: GradioClientLite, params: any[]): Promise<GradioImageResponse[]> {
        try {
            return await client.predict<GradioImageResponse[]>('/infer', params);
        } catch (error) {
            console.error('Prediction failed:', error);
            throw new Error('Failed to generate image prediction');
        }
    }

    private getAbsoluteFileUrl(fileUrl: string): string {
        if (!fileUrl.startsWith('http')) {
            return new URL(fileUrl, this.config.baseUrl).toString();
        }
        return fileUrl;
    }

    private async downloadFileWithRetry(fileUrl: string): Promise<FetchResponse> {
        
        let retries = 0;
        
        while (retries < this.config.maxRetries) {
            try {
                const response = await fetch(fileUrl);
                
                if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (!contentType?.includes('image')) {
                    throw new Error(`Unexpected content type: ${contentType}`);
                }
                return response;
                }

                const text = await response.text();
                console.log(`Attempt ${retries + 1} failed. Status: ${response.status}. Response:`, text);

                if (text.includes('File not found')) {
                const waitTime = Math.min(1000 * Math.pow(2, retries), this.config.maxWaitTime);
                console.log(`File not found. Waiting ${waitTime}ms before retry...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                retries++;
                continue;
                }

                throw new Error(`HTTP error! status: ${response.status}`);
            } catch (error) {
                console.log(`Error on attempt ${retries + 1}:`, error);
                if (retries === this.config.maxRetries - 1) throw error;
                retries++;
            }
        }

        throw new Error(`Failed to download file after ${this.config.maxRetries} attempts.`);
    }

    public async generateImage(req: Request, res: ExpressResponse): Promise<void> {
        try {

        const client = await this.connectToGradio();
        console.log('Connected to Gradio client');

        const params = [
            req.body.prompt || 'An image of a cat',
            req.body.param1 || 0,
            req.body.param2 || true,
            req.body.width || 512,
            req.body.height || 512,
            req.body.quality || 4
        ];

        const result = await this.predictImage(client, params);
        console.log('Prediction result:', JSON.stringify(result, null, 2));

        if (!result?.length) {
            res.status(404).json({ error: 'File not found in the result' });
            return;
        }

        const fileUrl = this.getAbsoluteFileUrl(result[0].url);
        console.log('Attempting to download file from:', fileUrl);

        const fileResponse = await this.downloadFileWithRetry(fileUrl);
        
        res.setHeader('Content-Disposition', 'attachment; filename="generated_image.webp"');
        res.setHeader('Content-Type', fileResponse.headers.get('content-type')!);
        
        // Pipe the response body to Express response
        if (fileResponse.body) {
            fileResponse.body.pipe(res);
        } else {
            throw new Error('No response body available');
        }

        } catch (error: any) {
            console.error('Error in generateImage:', error);
            res.status(500).json({
                error: 'An error occurred while processing the request.',
                details: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
}

// Esempio di utilizzo
const gradioConfig: GradioConfig = {
  spaceId: 'black-forest-labs/FLUX.1-schnell' as `${string}/${string}`,
  baseUrl: 'https://black-forest-labs-flux-1-schnell.hf.space',
  maxRetries: 5,
  maxWaitTime: 10000
};

export const gradioController = new GradioController(gradioConfig);