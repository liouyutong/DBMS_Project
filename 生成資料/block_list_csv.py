import random
import itertools
import csv

def main():
    # 設置參數
    N = 100  # 使用者總數 (100001 到 100100)
    K = 100  # 需要生成的配對總數 (100 筆)
    filename = "block_list.csv"

    # 1. 生成 N 個使用者 ID
    ids = [f"{i}" for i in range(100001, 100001 + N)]

    # 2. 生成所有不重複、非自配對的有序組合
    #    例如 (A, B) 和 (B, A) 都是不同的
    all_pairs = [
        (a, b) 
        for a, b in itertools.product(ids, repeat=2) 
        if a != b
    ]

    total_count = len(all_pairs)
    print(f"總共不重複且非自配對的組合數: {total_count} 筆")

    # 3. 檢查數量並隨機選取 K 筆
    if K > total_count:
        print(f"錯誤：要求的配對數量 {K} 超過總組合數 {total_count}。")
        return

    pairs_to_write = random.sample(all_pairs, K)

    # 4. 寫入 CSV 檔案
    with open(filename, "w", newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        # 寫入標題
        writer.writerow(["user_id", "partner_id"])
        # 寫入資料
        for uid, pid in pairs_to_write:
            writer.writerow([uid, pid])

    print(f"成功生成 {K} 筆不重複的配對，並寫入到 {filename}")

if __name__ == "__main__":
    main()
