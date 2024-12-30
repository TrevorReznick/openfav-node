import { Request, Response as ExpressResponse } from 'express';
import { GradioClientLite } from 'gradio-client-lite';
import fetch, { Response as FetchResponse } from 'node-fetch';

interface GradioImageResponse {
  path: string;
  url: string;
  size: number | null;
  orig_name: string;
  mime_type: string | null;
}

interface GradioConfig {
  spaceId: `${string}/${string}`;
  baseUrl: string;
  maxRetries: number;
  maxWaitTime: number;
  initialDelay: number;
}

class GradioController {

    private config: GradioConfig

    constructor(config: GradioConfig) {

        //let spaceId = /*const client = await GradioClientLite.connect(*/'black-forest-labs/FLUX.1-schnell'/*);*/
        
        this.config = {
            spaceId: config.spaceId,
            baseUrl: config.baseUrl,
            maxRetries: config.maxRetries || 5,
            maxWaitTime: config.maxWaitTime || 10000,
            initialDelay: config.initialDelay || 2000 // Delay iniziale prima del primo tentativo
        }
    }

    

    private async connectToGradio(): Promise<GradioClientLite> {
        try {
            return await GradioClientLite.connect("black-forest-labs/FLUX.1-schnell", {
                src: "https://black-forest-labs-flux-1-schnell.hf.space"
            })
        } catch (error) {
            console.error('Failed to connect to Gradio:', error);
            throw new Error('Failed to initialize Gradio client');
        }
      }

  private async predictImage(client: GradioClientLite, params: any[]): Promise<GradioImageResponse[]> {
    try {
      const result = await client.predict<GradioImageResponse[]>('/infer', params);
      return result;
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

  private async waitForImage(fileUrl: string): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      let retries = 0;
      
      // Delay iniziale per dare tempo al server di generare l'immagine
      await new Promise(r => setTimeout(r, this.config.initialDelay));

      const tryDownload = async () => {
        try {
          const response = await fetch(fileUrl);
          
          if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('image')) {
              throw new Error(`Unexpected content type: ${contentType}`);
            }

            // Converti direttamente la risposta in buffer
            const buffer = await response.buffer();
            if (buffer.length === 0) {
              throw new Error('Empty buffer received');
            }

            resolve(buffer);
            return;
          }

          const text = await response.text();
          console.log(`Attempt ${retries + 1} failed. Status: ${response.status}. Response:`, text);

          if (retries < this.config.maxRetries - 1) {
            retries++;
            const waitTime = Math.min(1000 * Math.pow(2, retries), this.config.maxWaitTime);
            console.log(`Waiting ${waitTime}ms before retry...`);
            setTimeout(tryDownload, waitTime);
          } else {
            reject(new Error(`Failed to download file after ${this.config.maxRetries} attempts`));
          }
        } catch (error) {
          console.error(`Error on attempt ${retries + 1}:`, error);
          if (retries < this.config.maxRetries - 1) {
            retries++;
            const waitTime = Math.min(1000 * Math.pow(2, retries), this.config.maxWaitTime);
            setTimeout(tryDownload, waitTime);
          } else {
            reject(error);
          }
        }
      };

      tryDownload()
    });
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
        res.status(404).json({ error: 'No result from prediction' });
        return;
      }

      const fileUrl = this.getAbsoluteFileUrl(result[0].url);
      console.log('Attempting to download file from:', fileUrl);

      try {
        const imageBuffer = await this.waitForImage(fileUrl);
        
        // Invia il buffer come risposta
        res.setHeader('Content-Type', 'image/webp');
        res.setHeader('Content-Length', imageBuffer.length);
        res.setHeader('Content-Disposition', 'attachment; filename="generated_image.webp"');
        res.send(imageBuffer);

      } catch (error: any) {
        console.error('Error downloading image:', error);
        res.status(500).json({
          error: 'Failed to download the generated image',
          details: error.message
        });
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

// Esempio di utilizzo con configurazione estesa
const gradioConfig: GradioConfig = {
  spaceId: 'black-forest-labs/FLUX.1-schnell' as `${string}/${string}`,
  baseUrl: 'https://black-forest-labs-flux-1-schnell.hf.space',
  maxRetries: 5,
  maxWaitTime: 10000,
  initialDelay: 2000  // Attesa iniziale di 2 secondi
};

export const gradioController = new GradioController(gradioConfig)