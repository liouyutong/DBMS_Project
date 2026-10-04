import random
from datetime import datetime, timedelta
import csv

def generate_content():
    sample_texts = [
        "Hello!", "How are you?", "Let's meet tomorrow.", "See you later.",
        "Good morning!", "Happy birthday!", "Congratulations!", 
        "Can you call me?", "Thank you!", "I will send it soon."
    ]
    return random.choice(sample_texts)

def generate_timestamp(start_date, end_date):
    delta = end_date - start_date
    random_seconds = random.randint(0, int(delta.total_seconds()))
    return start_date + timedelta(seconds=random_seconds)

def main():
    num_messages = 100
    num_users = 100
    filename = "letter_record.csv"  # CSV 輸出
    all_ids = [f"{i}" for i in range(100001, num_users+100001)]
    start_date = datetime(2025, 1, 1, 0, 0, 0)
    end_date = datetime(2025, 12, 31, 23, 59, 59)

    with open(filename, "w", newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        # 寫入表頭
        writer.writerow(["sender_id", "receiver_id", "content", "timestamp"])

        for _ in range(num_messages):
            sender = random.choice(all_ids)
            receiver = random.choice([uid for uid in all_ids if uid != sender])
            content = generate_content()
            timestamp = generate_timestamp(start_date, end_date).strftime("%Y-%m-%d %H:%M:%S")
            
            # 寫入每筆訊息
            writer.writerow([sender, receiver, content, timestamp])

    print(f"成功生成 {num_messages} 筆訊息到 {filename}")

if __name__ == "__main__":
    main()
