import json
import pandas as pd
from datetime import datetime

shipment_status_tool = {
    "toolSpec": {
        "name": "get_shipment_status",
        "description": (
            "Retrieve the latest shipment record for a given order or tracking number. "
            "Use tracking_id if available, otherwise use order_id and email together."
        ),
        "inputSchema": {
            "json": {
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "string",
                        "description": "The customer's order ID."
                    },
                    "email": {
                        "type": "string",
                        "description": "Customer email address, required if using order_id."
                    },
                    "tracking_id": {
                        "type": "string",
                        "description": "Shipment tracking identifier."
                    }
                },
                "required": []  # You can list required fields here
            }
        }
    }
}

async def get_shipment_status(
    order_id: str = None, email: str = None, tracking_id: str = None
):
    """
    Retrieves the latest shipment record for a given order or tracking number.
    Works with either tracking_id or (order_id + email).
    Returns a normalized dictionary for LLM tool consumption.
    """

    if not tracking_id and not (order_id and email):
        return {
            "found": False,
            "error": "Either tracking_id or (order_id + email) must be provided.",
        }

    try:
        df = pd.read_excel("shipments.xlsx")

        if tracking_id:
            filtered = df[
                df["tracking_id"].astype(str).str.strip() == str(tracking_id).strip()
            ]
        else:
            filtered = df[
                (df["order_id"].astype(str).str.strip() == str(order_id).strip())
                & (
                    df["email"].astype(str).str.strip().str.lower()
                    == str(email).strip().lower()
                )
            ]

        if filtered.empty:
            return {"found": False}

        filtered["last_update"] = pd.to_datetime(
            filtered["last_update"], errors="coerce"
        )
        filtered = filtered.sort_values("last_update", ascending=False)
        record = filtered.iloc[0]

        result = {
            "found": True,
            "order_id": str(record.get("order_id", "")),
            "tracking_id": str(record.get("tracking_id", "")),
            "carrier": str(record.get("carrier", "")),
            "status": str(record.get("status", "")),
            "last_update": str(record.get("last_update", "")),
        }

        if "eta" in record and pd.notna(record["eta"]):
            result["eta"] = str(record["eta"])
        if "destination" in record and pd.notna(record["destination"]):
            result["destination"] = str(record["destination"])

        return result

    except FileNotFoundError:
        return {"found": False, "error": "Shipment data file not found."}
    except Exception as e:
        return {"found": False, "error": str(e)}
