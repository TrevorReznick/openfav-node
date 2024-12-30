//mport { Response} from '../interfaces/ResponsesRequests'
import { Response as ExpressResponse, Request } from 'express';
import { GradioClientLite } from 'gradio-client-lite'
import fs from 'fs'

export class SubController {

    static async home(req: any, res: ExpressResponse) {

        console.log('hello from controller')

        const msg: any = req.body

        console.log('controller body request', msg)

        try {
            //let message = await doChat(msg)
            let message = msg
            console.log(message)
            res.send(message)
        } catch(e) {
            res.status(500).send(e)
        }
    }    
    
    static async testGradio(req: Request, res: ExpressResponse) {
        try {
          const client = await GradioClientLite.connect('black-forest-labs/FLUX.1-schnell');
    
          console.log('Connected to Gradio client');
    
          const result = await client.predict<{ path: string; url: string }[]>('/infer', [
            'An image of a cat', // Prompt
            0,                   // Parametro numerico
            true,                // Opzione booleana
            512,                 // Larghezza immagine
            512,                 // Altezza immagine
            4,                   // Numero di immagini o qualità
          ]);
    
          console.log('Prediction result:', JSON.stringify(result, null, 2));
    
          if (result && result.length > 0) {
            const fileData = result[0];
            let fileUrl = fileData.url;
    
            // If the URL is not absolute, construct it using the base URL
            if (!fileUrl.startsWith('http')) {
              const baseUrl = 'https://black-forest-labs-flux-1-schnell.hf.space';
              fileUrl = new URL(fileUrl, baseUrl).toString();
            }
    
            console.log('Attempting to download file from:', fileUrl);
    
            // Retry logic with exponential backoff
            const maxRetries = 5;
            const maxWaitTime = 10000; // 10 seconds
            let retries = 0;
    
            while (retries < maxRetries) {
              try {
                const fileResponse: any = await fetch(fileUrl)
                
                if (fileResponse.ok) {
                  const contentType = fileResponse.headers.get('content-type');
                  
                  if (contentType && contentType.includes('image')) {
                    // Imposta gli headers per il download
                    res.setHeader('Content-Disposition', `attachment; filename="generated_image.webp"`);
                    res.setHeader('Content-Type', contentType);
    
                    // Pipe del file scaricato direttamente alla risposta
                    fileResponse.body.pipe(res);
                    return;
                  } else {
                    console.log(`Unexpected content type: ${contentType}`);
                    throw new Error('Unexpected content type');
                  }
                } else {
                  const text = await fileResponse.text();
                  console.log(`Attempt ${retries + 1} failed. Status: ${fileResponse.status}. Response:`, text);
                  
                  if (text.includes('File not found')) {
                    // Wait before retrying
                    const waitTime = Math.min(1000 * Math.pow(2, retries), maxWaitTime);
                    console.log(`File not found. Waiting ${waitTime}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    retries++;
                  } else {
                    throw new Error(`HTTP error! status: ${fileResponse.status}`);
                  }
                }
              } catch (error: any) {
                console.log(`Error on attempt ${retries + 1}:`, error.message);
                if (retries === maxRetries - 1) throw error;
                retries++;
              }
            }
    
            throw new Error(`Failed to download file after ${maxRetries} attempts.`);
          } else {
            res.status(404).json({ error: 'File not found in the result' });
          }
        } catch (error: any) {
          console.error('Error in testGradio:', error);
          res.status(500).json({ 
            error: 'An error occurred while processing the request.', 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
          });
        }
    }
    
}

