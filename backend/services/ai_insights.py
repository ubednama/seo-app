import json
from typing import Dict, List, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIResponse(BaseModel):
    """Pydantic model to structure the AI's JSON output."""
    summary: str = Field(description="A 2-3 paragraph executive summary of the SEO analysis.")
    recommendations: List[str] = Field(description="A list of 3 to 5 actionable recommendations to improve the SEO score.")

class AIInsightGenerator:
    """
    A service to generate human-readable SEO insights from raw metrics using Gemini.
    """
    def __init__(self, api_key: str, model_name: str = "gemini-1.5-flash"):
        """
        Initializes the AI Insight Generator with the Gemini model and output parser.
        """
        try:
            if not api_key:
                raise ValueError("API Key is missing or empty.")
            
            # Updated model to standard 'gemini-1.5-flash' which is robust for free tier
            self.model = ChatGoogleGenerativeAI(
                model=model_name,
                google_api_key=api_key, 
                temperature=0.7
            )
            self.parser = JsonOutputParser(pydantic_object=AIResponse)
            
            self.prompt = ChatPromptTemplate.from_messages([
                ("system", 
                 "You are an expert Technical SEO Auditor. Your task is to analyze a set of SEO metrics and provide a critical but helpful summary and a list of actionable recommendations. "
                 "Focus on the issues that caused penalties in the SEO score. Your response must be in valid JSON format. "
                 "Here are the formatting instructions: {format_instructions}"),
                ("human", "Please analyze the following SEO metrics and generate your insights: \n\n```json\n{metrics}\n```")
            ])
            
            self.chain = self.prompt | self.model | self.parser

        except ValueError as ve:
            logger.error(ve)
            self.chain = None
        except Exception as e:
            logger.error(f"Failed to initialize AIInsightGenerator: {e}")
            self.chain = None

    def generate_insights(self, metrics: Dict) -> Dict:
        """
        Generates SEO insights and recommendations from a dictionary of metrics.
        """
        if not self.chain:
            return self._get_fallback_response("AI Insight Generator not initialized.")

        try:
            # Convert the metrics dictionary to a JSON string for clear prompting
            metrics_str = json.dumps(metrics, indent=2)
            
            # Invoke the LangChain to get the structured output
            result = self.chain.invoke({
                "metrics": metrics_str,
                "format_instructions": self.parser.get_format_instructions()
            })
            return result
        
        except Exception as e:
            logger.error(f"AI insight generation failed: {e}", exc_info=True)
            return self._get_fallback_response(str(e))

    def _get_fallback_response(self, error_message: str) -> Dict:
        """Returns a default dictionary when AI analysis fails."""
        logger.warning(f"Returning fallback response due to error: {error_message}")
        return {
            "summary": "AI analysis is currently unavailable due to a technical issue.",
            "recommendations": [
                "Please try again later.",
                "Verify API key configuration.",
                f"Error: {error_message[:100]}..." # Return partial error to UI for debugging
            ]
        }