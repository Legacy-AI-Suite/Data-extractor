from fastapi import APIRouter, UploadFile, File
import csv, io

router = APIRouter(prefix="/extract", tags=["extract"])

@router.post("/csv")
async def extract_csv(file: UploadFile = File(...)):
    # Read and decode uploaded CSV
    content = await file.read()
    text = content.decode("utf-8", errors="ignore")
    reader = csv.DictReader(io.StringIO(text))

    headers = reader.fieldnames or []
    sample_rows = []
    for i, row in enumerate(reader):
        if i >= 5:
            break
        sample_rows.append(row)

    return {"columns": headers, "sample": sample_rows}
