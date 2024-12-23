// server/app/controllers/screenshotController.ts
import { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { upload, UploadedFile } from './storage'

const captureScreenshot = async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL obbligatorio' });
  }

  try {
    // Chiamata all'API di Hugging Face per catturare lo screenshot
    const response = await axios.post(
      'https://huggingface.co/spaces/kargaranamir/selenium-screenshot-gradio/run/predict',
      {
        data: [url]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Estrai l'URL dell'immagine dal risposta
    const imageData = response.data.data[0];
    const imageBuffer = Buffer.from(imageData, 'base64');

    // Definisci il percorso di salvataggio dell'immagine
    const destination = '/images'
    const filename = Date.now() + '.png';
    const imagePath = path.join(destination, filename);

    // Salva l'immagine nel volume montato
    fs.writeFileSync(imagePath, imageBuffer);

    // Crea un oggetto UploadedFile per restituire la risposta
    const uploadedFile: UploadedFile = {
      fieldname: 'image',
      originalname: filename,
      encoding: 'base64',
      mimetype: 'image/png',
      size: imageBuffer.length,
      destination: destination,
      filename: filename,
      path: imagePath,
      buffer: imageBuffer
    };

    // Restituisci l'URL dell'immagine salvata
    const imageUrl = `/images/${filename}`

    res.status(200).json({ message: 'Screenshot catturato correttamente', file: uploadedFile, image: imageUrl })
  } catch (error: any) {
    console.error('Errore durante la cattura dello screenshot:', error)
    res.status(500).json({ message: 'Errore durante la cattura dello screenshot', error: error.message })
  }
};

export { captureScreenshot }