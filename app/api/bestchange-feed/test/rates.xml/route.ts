import os
import asyncio
import xml.etree.ElementTree as ET
from flask import Flask, Response
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = "https://jetfadpysjsvtqdgnsjp.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)
xml_cache = ""  # Храним актуальный XML в памяти


def generate_xml_from_rows(rows):
    """Формирует XML в формате Exnode из таблицы kenig_rates"""
    root = ET.Element("rates")

    for row in rows:
        item = ET.SubElement(root, "item")

        ET.SubElement(item, "from").text = str(row["from_currency"])
        ET.SubElement(item, "to").text = str(row["to_currency"])
        ET.SubElement(item, "in").text = "1"
        ET.SubElement(item, "out").text = str(row["sell"])
        ET.SubElement(item, "amount").text = str(row.get("reserve", 1000000))
        ET.SubElement(item, "minamount").text = str(row.get("minamount", 100))
        ET.SubElement(item, "maxamount").text = str(row.get("maxamount", 1000000))
        ET.SubElement(item, "param").text = "manual,veryfying"

    return ET.tostring(root, encoding="utf-8", xml_declaration=True).decode()


def refresh_xml():
    """Пересоздает XML из Supabase"""
    global xml_cache
    print("🔄 Обновляем XML...")
    response = supabase.table("kenig_rates").select("*").eq("is_active", True).execute()
    rows = response.data or []
    xml_cache = generate_xml_from_rows(rows)
    with open("rates.xml", "w", encoding="utf-8") as f:
        f.write(xml_cache)
    print(f"✅ XML обновлён ({len(rows)} записей)")


@app.route("/rates.xml")
def get_rates():
    """HTTP endpoint для получения актуального XML"""
    return Response(xml_cache, mimetype="application/xml")


async def listen_for_changes():
    """Подписка на изменения таблицы через Supabase Realtime"""
    from realtime import Client as RealtimeClient

    REALTIME_URL = SUPABASE_URL.replace("https://", "wss://").replace(".co", ".co/realtime/v1")
    print(f"📡 Подключаемся к Supabase Realtime: {REALTIME_URL}")
    realtime = RealtimeClient(REALTIME_URL, params={"apikey": SUPABASE_KEY})

    async def on_change(payload):
        print("📥 Изменение в kenig_rates:", payload.event_type)
        refresh_xml()

    channel = realtime.channel("realtime:public:kenig_rates")
    channel.on("postgres_changes", {"event": "*", "schema": "public", "table": "kenig_rates"}, on_change)
    await channel.subscribe()

    await realtime.connect()
    print("✅ Подписка на изменения установлена")

    while True:
        await asyncio.sleep(30)


if __name__ == "__main__":
    refresh_xml()  # Первичная генерация XML

    import threading

    threading.Thread(target=lambda: app.run(host="0.0.0.0", port=8080)).start()

    asyncio.run(listen_for_changes())
