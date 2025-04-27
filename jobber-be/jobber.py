from duckduckgo_search import DDGS
import os
import cohere
from dotenv import load_dotenv


load_dotenv()

COHERE_API_KEY = os.getenv("COHERE_API_KEY")
co = cohere.ClientV2(COHERE_API_KEY)

MODEL = os.getenv("COHERE_MODEL")
temperature = float(os.getenv("TEMPERATURE"))
search = DDGS()

system_prompt = """
Given the Company Title {title} along with its description {description} and {question} formalize the output with below contents and return the output in markdown format.
Example
- **Company**: ABC Analytics
- **Role**: Machine Learning Engineer
- **YoE**: 3 years
- **Salary**: 20 LPA with 16 Base (In Hand) 2 Joining Bonus and 2 Performance Bonus
- **Work Life Balance**: Strict 9-5 job
- **Growth Opportunities**: Opportunities to grow in your role is higher
- **Culture**: Good culture
- **Hike**: Minimal ranging from 3-5% per year
- **Notice Period**: 3 Months
- **Roles and Responsibilities or Expectations for the role**:
    - As a MLE you need to have indepth knowledge in Python, SQL, PySpark.
    - End to End Model Development and Deployment.
    - Knowledge of Backend and DevOps.
    - Business Knowledge, Domain Knowledge or understanding
    - EDA, Data preprocessing, Hyperparameter Tuning
    - Fine Tuning LLM using LoRA, PEFT
Note: Return the response only once.
"""

class Jobber:
    def __init__(self, question):
        self.question = question
        self.result = []
        self.answer = ""
        self.references = ""
    
    def get_search_result(self):
        search_results = search.text(self.question, max_results=5)
        for res in search_results:
            self.result.append(
                {
                    "title": res['title'],
                    'description': res['body']
                }
            )
            start_idx = res['href'].find(".") + 1
            end_idx = start_idx + res['href'][start_idx: ].find(".")
            self.references += f"- [{res['href'][start_idx: end_idx]}]({res['href']})\n"
            
    # @get_search_result
    def formalize_result(self):
        self.get_search_result()
        final_prompt = system_prompt.format(
                title=[i['title'] for i in self.result],
                description=[i['description'] for i in self.result],
                question = self.question,
        )
        print(final_prompt)
        completion = co.chat(
            model=MODEL,
            messages=[
                # {
                #     "role": "system", 
                #     "content": system_prompt
                # },
                {
                    "role": "user", 
                    # "content": f"Context: {self.result}\nQuestion:{self.question}"
                    "content": final_prompt
                }
            ],
            temperature=temperature,
        )

        output = completion.message.content[0].text
        output = output.replace("```markdown", "").replace("```","")
        output += f"\n\n### References\n{self.references}"
        return output
