# Тут будут описаны все классы, которые являются смежными у бека и фронта

## User
 
```ts
interface User{
    username: string
    password: string
}
```

```python
class User(BaseModel):
    username: str
    password: str
```

## GenerateAnswer

```ts
export interface GeneratedAnswer {
    keys: string[]
    values: number[]
}
```

```python
class GeneratedAnswer(BaseModel):
    keys: list[str]
    values: list[int]
```