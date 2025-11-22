import math
import random
from models.generated_answ import GeneratedAnswer
import string
def generate_data() -> GeneratedAnswer:
    keys = [''.join(random.choices(string.ascii_letters + string.digits, k=8))]
    values = [random.randint(0, 100)]
    return GeneratedAnswer(keys=keys, values=values)