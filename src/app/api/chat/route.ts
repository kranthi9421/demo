import { ModelFusionTextStream } from '@modelfusion/vercel-ai';
import {Message, StreamingTextResponse } from 'ai';
import {
  ChatMLPromptFormat,
  TextChatMessage,
  ollama,
  streamText,
} from 'modelfusion';

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json()

   const prompt = {
     system: "You are an AI chatbot. Follow the user's instructions carefully.",

     messages: messages.filter(
       (message) => message.role === 'user' || message.role === 'assistant'
     ) as TextChatMessage[],
   }

   const model = ollama
     .TextGenerator({
       model: 'openhermes2.5-mistral',
       maxCompletionTokens: -1, 
       temperature: 0,
       raw: true, 
     })
     .withPromptFormat(ChatMLPromptFormat.chat()) 

   const textStream = await streamText(model, prompt)


  return new StreamingTextResponse(ModelFusionTextStream(textStream))
}





  