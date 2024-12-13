import huggingface_hub
from typing import List, Dict
from huggingface_hub import InferenceClient
class ChatBot:
    def __init__(self, api_token: str):
        self.client = InferenceClient(api_key=api_token)
        self.model = "Qwen/Qwen2.5-72B-Instruct"

    def generate_response(self, context: str, chat_history: List[Dict[str, str]]) -> str:
        """
        Generate a response based on the provided context and chat history.
        This method constructs a message sequence including a system message, 
        the given context, and the chat history, then uses an AI model to 
        generate a response.
        Args:
            context (str): The current context or query from the user.
            chat_history (List[Dict[str, str]]): A list of dictionaries containing 
                                                 the chat history with keys "role" 
                                                 and "content".
        Returns:
            str: The generated response from the AI model.
        """
        
        
        system_msg = "You are a helpful AI assistant that provides clear and concise information based on the given context and chat history."
        
        formatted_history = []
        for msg in chat_history:
            formatted_history.append({"role": msg["role"], "content": msg["content"]})
    
        messages = [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": f"Context: {context}"},
        ]
        messages.extend(formatted_history)
        print(messages)
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7,
            max_tokens=1024,
            top_p=0.9
        )
        
        return response.choices[0].message.content
    
    def query(self, query:str):
        messages = [
            { "role": "user", "content": query }
        ]

        completion = self.client.chat.completions.create(
            model=self.model, 
            messages=messages, 
            temperature=0.5,
            max_tokens=2048,
            top_p=0.7
        )

        return completion.choices[0].message.content
    
    def generate_notes(self, context: str):
        prompt = f"""Generate notes based on the following context: 
        {context}
        
        """
        messages = [
            { "role": "user", "content": query }
        ]

        completion = self.client.chat.completions.create(
            model=self.model, 
            messages=messages, 
            temperature=0.5,
            max_tokens=2048,
            top_p=0.7
        )