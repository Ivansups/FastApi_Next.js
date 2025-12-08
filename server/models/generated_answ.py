from pydantic import BaseModel


class GeneratedAnswer(BaseModel):
    keys: list[str]
    values: list[int]
