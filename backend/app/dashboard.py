"""Dashboard aggregates from persisted detections."""

from datetime import timedelta

from fastapi import APIRouter, Request
from sqlalchemy import text

from app.categories import YOLO_CLASS_NAMES


router = APIRouter()


@router.get("/dashboard/stats")
def dashboard_stats(request: Request):
    with request.app.state.db_session_factory() as session:
        overview = session.execute(text("""SELECT COUNT(*) AS total,
            COALESCE(AVG(confidence), 0) AS avg_confidence,
            SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS today
            FROM detections""")).mappings().one()
        counts = dict(session.execute(text("""SELECT primary_category, COUNT(*)
            FROM detections GROUP BY primary_category""")).all())
        categories = {row["category_key"]: row for row in session.execute(
            text("""SELECT category_key, name_vi, bin_color_hex
                FROM waste_categories""")
        ).mappings()}
        today = session.execute(text("SELECT CURDATE()" )).scalar_one()
        daily = dict(session.execute(text("""SELECT DATE(created_at), COUNT(*)
            FROM detections WHERE created_at >= CURDATE() - INTERVAL 6 DAY
            AND created_at < CURDATE() + INTERVAL 1 DAY
            GROUP BY DATE(created_at)""")).all())

    total = overview["total"]
    category_counts = [
        {"category": categories[key]["name_vi"], "categoryKey": key,
         "count": counts.get(key, 0),
         "percentage": round(counts.get(key, 0) * 100 / total) if total else 0,
         "color": categories[key]["bin_color_hex"]}
        for key in YOLO_CLASS_NAMES
    ]
    most_common = max(category_counts, key=lambda item: item["count"])
    return {
        "total_scans": total,
        "most_common_type": most_common["category"] if total else "Chưa có dữ liệu",
        "average_confidence": round(float(overview["avg_confidence"]) * 100, 1),
        "today_scans": overview["today"] or 0,
        "category_counts": category_counts,
        "time_series": [
            {"date": day.strftime("%d/%m"), "count": daily.get(day, 0)}
            for day in (today - timedelta(days=offset) for offset in range(6, -1, -1))
        ],
    }
