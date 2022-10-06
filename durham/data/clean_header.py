import re

QUESTION_NUMBER_W_BRACKET = re.compile(r"Q(\d\d?\w?-?\d?)\[(\d\d)\] +")
QUESTION_NUMBER_WITHOUT_BRACKET = re.compile(r"Q(\d\d?\w?-?\d?)")
HEADER_SPLIT = re.compile(r" {1,2}\[(\d\d?)?")


def lower_and_remove_spaces(name):
  remove_chars = list("?:[]()/:-")
  to_return = ".".join(name.split(" ")).lower()
  for char in remove_chars:
    to_return = to_return.replace(char, "")
  return to_return.strip(".")


def clean_q_num(q_num):
  return q_num.replace("Q", "").replace("[", ".").replace("]", "").replace(" ", "").replace("-", ".")

if __name__ == "__main__":
  with open("./durham_2020_raw.csv") as f:
    raw_header = f.readline()
    remaining_rows = f.readlines()

  column_names = raw_header.split(",")

  new_column_names = []
  for column_name in column_names:
    if not column_name.startswith("Q"):
      new_column_names.append(lower_and_remove_spaces(column_name))
    elif "[" in column_name:
      splitted = HEADER_SPLIT.split(column_name)
      q_num = splitted[0]
      question = splitted[-1]
      question_cleaned = lower_and_remove_spaces(question)
      new_column_names.append(f"{question_cleaned}.{clean_q_num(q_num)}")
    else:
      splitted = column_name.split(" ")
      q_num, question = splitted[0], " ".join(splitted[1:])
      question_cleaned = lower_and_remove_spaces(question)
      new_column_names.append(f"{question_cleaned}.{clean_q_num(q_num)}")    
  
  with open("./durham_2020_cleaner_headers.csv", "w") as f:
    f.write(f"{','.join(new_column_names)}\n")
    f.writelines(remaining_rows)
