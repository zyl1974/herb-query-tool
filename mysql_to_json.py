import mysql.connector
import json
from datetime import datetime

def mysql_to_json(config, tables, output_dir='./data'):
    try:
        db = mysql.connector.connect(
            host=config['host'],
            user=config['user'],
            password=config['password'],
            database=config['database'],
            charset='utf8mb4'
        )
        cursor = db.cursor(dictionary=True)
        
        import os
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        for table in tables:
            cursor.execute(f"SELECT * FROM {table}")
            rows = cursor.fetchall()
            
            # 处理特殊类型（如日期时间）
            processed_rows = []
            for row in rows:
                processed_row = {}
                for key, value in row.items():
                    if isinstance(value, datetime):
                        processed_row[key] = value.strftime('%Y-%m-%d %H:%M:%S')
                    else:
                        processed_row[key] = value
                processed_rows.append(processed_row)
            
            # 保存为JSON文件（覆盖旧文件）
            output_file = f"{output_dir}/{table}.json"
            # 新增：判断文件是否存在，存在则提示
            if os.path.exists(output_file):
                print(f"警告：文件 {output_file} 已存在，新数据将覆盖旧数据！")
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(processed_rows, f, ensure_ascii=False, indent=2)
            
            print(f"表 {table} 导出完成，共 {len(processed_rows)} 条记录，保存至 {output_file}")
        
        cursor.close()
        db.close()
        print("所有表导出完成")
        
    except mysql.connector.Error as err:
        print(f"数据库错误: {err}")
    except Exception as e:
        print(f"导出过程出错: {e}")

if __name__ == "__main__":
    db_config = {
        'host': 'localhost',       
        'user': 'root',            
        'password': '',  
        'database': '藏羌彝医药查询'   
    }
    
    tables_to_export = [
     'herbs', 
    ]
    
    mysql_to_json(db_config, tables_to_export)