//import * as fs from "fs"
//import { promisify } from "util"
//import {RequestPrompt} from '../controllers/index'
import { promises as fs } from "fs"
import axios from "axios"
import dotenv from 'dotenv'

dotenv.config()

const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"

const headers = {
    //Authorization: "Bearer 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",
    Authorization: 'Bearer ' + process.env.HF_ACCESS_TOKEN
}

async function query(data: any): Promise<ArrayBuffer> {
    try {
        const response = await axios.post(API_URL, data, {
            headers,
            responseType: "arraybuffer",
        })

        return response.data
    } catch (error) {
        throw error
    }
}

export async function generateImage(caption: string) {
    try {
        const imageBytes = await query({
            inputs: caption,
        })
        // Generate a file name with the caption and save the image
        const fileName = `${caption.replace(/\s+/g, "-")}.png`
        const filePath = "./test/" + fileName
        await fs.writeFile(filePath, Buffer.from(imageBytes));
        console.log(`Image saved to: ${filePath}`)
    } catch (error) {
        console.log('function pass from here, is error')
        console.log(error)
    }
}

export async function getImage(caption: string) {

    try {
        const imageBytes = await query({
            inputs: caption,
        })
        // Generate a file name with the caption and save the image
        const fileName = `${caption.replace(/\s+/g, "-")}.png`
        const filePath = "./test/" + fileName

        const encodedBuffer = Buffer.from(imageBytes).toString('base64')

        console.log(encodedBuffer)
        
        return encodedBuffer 
               
    } catch (error) {
        console.log('function pass from here, is error')
        console.log(error)
    }


    
    /*
    try {

        const imageBytes = await query({
            inputs: caption,
        })
        const fileName = `${caption.replace(/\s+/g, "-")}.png`
    
        // Send image file as response
        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': imageBytes.length
        });
    
        res.send(imageBytes);
    
      } catch (error) {
        console.error(error);
        res.status(500).end('Error generating image');
      }
    
    }
    
    // Usage:
    app.get('/image', async (req, res) => {
    
      const imageBytes = await generateImage('My Caption');
    
      await sendGeneratedImage(imageBytes, res);
    
    });
    
    // With curl:
    curl http://localhost:3000/image > image.png
    */
    
}
