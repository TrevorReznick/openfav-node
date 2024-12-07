import axios from 'axios'

export async function doChat(msgObj: any[]) {

    // Assicurati che msgObj contenga un array di oggetti con le proprietà 'role' e 'message'

    const previousMessages: { role: string; message: string }[] = msgObj

    // Non è necessario utilizzare concat se previousMessages è già un array
    let messages: { role: string; message: string }[] = previousMessages

    const prompt = messages.map((message) => `${message.role}: ${message.message}`).join('\n') + `\nAI:`

    const API_URL = 'https://api.openai.com/v1/completions'

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    }

    //console.log('api key', process.env.OPENAI_API_KEY)

    const data = JSON.stringify({
        model: 'text-davinci-003',
        prompt: prompt,
        temperature: 0.9,
        max_tokens: 512,
        top_p: 1.0,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: [' User:', ' AI:'],
    })


    try {
        const req: any = axios.post(API_URL, data, {
            headers,
            responseType: "json",
        })
        const res = await req.json()
        const result = res.choices[0]

        return result /*message: result.text*/
        
    } catch (error) {
        throw error
    }
}