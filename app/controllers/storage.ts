const fs = require('fs')
const path = require('path')
const multer = require('multer')
import {UploadedFile} from '../interfaces/Upload'

const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
      cb(null, '/app/images'); // Percorso montato del volume
    },
    filename: function (req: any, file: any, cb: any) {
      cb(null, Date.now() + path.extname(file.originalname)) // Rinomina il file per evitare conflitti di nomi
    }
})
  
const upload = multer({ storage: storage })
  
  // Controller per il caricamento dell'immagine
const uploadImage = (req: any, res: any) => {

    const file: UploadedFile = req.file
  
    if (!file) {
      return res.status(400).json({ message: 'Nessun file inviato' })
    }
    res.status(200).json({ message: 'Immagine caricata correttamente', file: file })
}
  
export { upload, uploadImage }