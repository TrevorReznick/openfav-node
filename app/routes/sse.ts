// Importa i moduli richiesti
const express = require('express')
const router = express.Router()

// Endpoint SSE
router.get('/sse', (req: any, res: any) => {
  // Imposta gli header per SSE
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // Gestione della chiusura della connessione
  req.on('close', () => {
    console.log('Client disconnected from SSE')
    res.end(); // Chiude la connessione
  });

  // Invio iniziale per testare la connessione
  res.write(`data: ${JSON.stringify({ message: 'Connection established' })}\n\n`)

  // Invio di eventi periodici
  const intervalId = setInterval(() => {
    const eventData = { metric: Math.random(), timestamp: new Date() }
    res.write(`event: metric\n`);
    res.write(`data: ${JSON.stringify(eventData)}\n\n`)
  }, 1000);

  // Pulisci l'intervallo alla disconnessione
  req.on('close', () => {
    clearInterval(intervalId)
  });
});

module.exports = router
