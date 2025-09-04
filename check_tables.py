import mysql.connector

def check_tables(config):
    try:
        # 连接数据库
        db = mysql.connector.connect(
            host=config['host'],
            user=config['user'],
            password=config['password'],
            database=config['database'],
            charset='utf8mb4'
        )
        
        cursor = db.cursor()
        
        # 查询所有表名
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        print(f"数据库 {config['database']} 中的表名如下：")
        for table in tables:
            print(f"- {table[0]}")  # 打印表名
        
        cursor.close()
        db.close()
        
    except mysql.connector.Error as err:
        print(f"错误：{err}")

if __name__ == "__main__":
    # 用你自己的数据库配置
    db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': '',  # 你的MySQL密码
        'database': '藏羌彝医药查询'   # 你的数据库名称
    }
    
    check_tables(db_config)
