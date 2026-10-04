import random
import string
import csv

def generate_password(length=10):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

def generate_email(user_id, domain="gmail.com"):
    return f"{user_id}@{domain}"

def main():
    filename = "authentication.csv"  # 改成 CSV

    with open(filename, "w", newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["id", "email", "password"])  # CSV 標題

        for i in range(1, 101):
            user_id = f"{100000 + i:06d}"  # 六位數且第一個數字是 1，例如：100001
            email = generate_email(user_id)
            password = generate_password(10)
            writer.writerow([user_id, email, password])

    print(f"已產生 CSV 檔案：{filename}")

if __name__ == "__main__":
    main()
