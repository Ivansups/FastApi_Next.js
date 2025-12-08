import random
import string

from server.models.generated_answ import GeneratedAnswer


def generate_data() -> GeneratedAnswer:
    keys = [''.join(random.choices(string.ascii_letters + string.digits, k=8))]
    values = [random.randint(0, 100)]
    return GeneratedAnswer(keys=keys, values=values)
