# Smart Waste AI — implementation progress

This file tracks the AI, backend, database, and frontend integration work. The API contract remains `docs/API_CONTRACT.md`.

## Decisions

| ID | Decision | Status |
| --- | --- | --- |
| D1 | Keep seven YOLO detection classes and use seven separate waste categories with the same keys. Use material-inspired UI colors and class-specific guides. A no-detection image returns HTTP 422 with `detail: "Không phát hiện loại rác phù hợp"`. | APPROVED by Member 1 on 2026-11-19. B3 uses the highest-confidence detection as the primary object. |

The YOLO class order is fixed: `banana-peel`, `glass`, `metal`, `orange-peel`, `paper`, `plastic`, `styrofoam`.

## Tasks

| ID | Task | Priority | Dependencies | Status | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| A1 | Align dataset and training configuration | P0 | None | DONE | Seven class IDs and all three split paths match the local Roboflow export. |
| A2 | Train and evaluate YOLOv8s | P0 | A1 | DONE | 100 epochs complete; `best.pt` has seven classes; validation and test metrics recorded below; inference returns pixel boxes. |
| B1 | Backend configuration and image storage | P0 | None | DONE | Environment configuration loads without hard-coded secrets; stored images have safe names and working URLs. |
| DB1 | MySQL connection | P0 | None | DONE | Existing schema can be queried; failed writes roll back without dropping data. |
| DB2 | Category and guide data | P0 | D1, DB1 | DONE | Seven approved category keys, names, colors, and guides agree across seed data, backend, frontend, and API documentation. |
| B2 | Inference and detection normalization | P0 | A2, B1, D1 | DONE | All seven labels, confidence values, pixel boxes, processed image, and no-detection behavior follow the approved rules. |
| B3 | `POST /api/predict` | P0 | B1, B2, DB1, DB2 | DONE | Upload, inference, storage, DB transaction, and response follow the API contract. |
| B4 | History list and detail | P1 | DB1, B3 | DONE | Filtering, search, sorting, pagination, and detail match the API contract and frontend fields. |
| B5 | Dashboard stats | P1 | DB1, DB2 | DONE | Counts, average confidence, category distribution, and seven-day series match the API contract. |
| I1 | Frontend Live API integration | P1 | B3, B4, B5, D1 | DONE | Detection, history, and dashboard work with real API data; only directly related frontend files are changed after review. |
| Q1 | End-to-end verification and operating docs | P1 | I1 | DONE | An upload produces a detection, stored images, a history entry, and updated dashboard statistics. |
| O1 | Repeatable dataset audit | P2 | A1 | TODO (optional) | A read-only check reports split counts, class IDs, and invalid labels. |
| O2 | API operational hardening | P2 | B3, B4, B5 | TODO (optional) | Failure paths avoid orphaned files and partial database writes. |
| U1 | Choose another image and clear current result | P1 | I1 | DONE | Result screen can open the file picker directly or clear only its local display state; saved history remains untouched. |
| U2 | Delete one history scan | P1 | B4, U1 | DONE | A confirmed delete removes one scan, its detected objects, and its stored images; History and Dashboard refresh. |

## A2 model result — 2026-11-19

- Dataset: Roboflow export v1, 2,723 train / 628 validation / 616 test images; seven detection classes unchanged.
- Training: YOLOv8s, 100 epochs, image size 640, automatic batch sizing, `workers=0` on Windows; Ultralytics 8.4.215 and PyTorch 2.7.1+cu118.
- Best checkpoint: `runs/detect/smart_waste_yolo-2/weights/best.pt`; deployment copy: `backend/weights/best.pt`. Both have SHA-256 `1C5A8D4D8B78B203D13164575968DB8003AFB3522A35CD1B4B1DCBAE5BF6F5B7`.
- Validation of `best.pt`: precision 0.748, recall 0.782, mAP50 0.809, mAP50–95 0.573 (628 images, 728 objects).
- Independent test split: precision 0.783, recall 0.769, mAP50 0.814, mAP50–95 0.607 (616 images, 683 objects).
- Sample inference: one test image loaded successfully; `best.pt` reported all seven class names and a pixel `xyxy` bounding box.
- Limitation: class `glass` has test recall 0.560 and mAP50–95 0.330, lower than the other classes. No additional training decision has been made.
- Training outputs and model weights are ignored by Git. No commit or push has been made.

## B1 storage result — 2026-11-19

- `backend/app/config.py` loads `backend/.env` through the existing `python-dotenv` dependency, resolves `YOLO_MODEL_PATH` relative to `backend/`, and validates `CONFIDENCE_THRESHOLD` within `[0, 1]`.
- `backend/app/storage.py` accepts verified JPEG, PNG, and WEBP images, limits original uploads to 10 MB, writes UUID filenames under `uploads/originals` or `uploads/predictions`, and exposes their `/uploads/...` paths. The caller can delete a saved file when a later step fails.
- `backend/app/main.py` uses the same storage root for `StaticFiles` and exposes settings and storage on `app.state` for later routers.
- Checks passed: image validation, unique filenames, URL paths, deletion, configuration defaults/overrides, `GET /health`, and HTTP retrieval of a stored PNG through `/uploads`.
- Full public URLs will be generated from the incoming request by the future prediction router; no `/api/predict` endpoint or category mapping was added in B1.

## DB1 result — 2026-11-19

- MySQL80 is running and port 3306 is reachable. The owner created local `backend/.env` without sharing the password in chat.
- `backend/app/config.py` reads the existing `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` variables. The password is excluded from the settings representation.
- `backend/app/db.py` builds a MySQL SQLAlchemy engine with `utf8mb4`, supplies sessions with commit/rollback handling, and checks the three existing tables through read-only queries. This module does not execute DDL or seed data.
- With the owner's approval, the existing `database/schema.sql` was executed unchanged to create `smart_waste_db` and its three tables. `seed_data.sql` was not executed.
- Verified with an in-memory database: URL password handling, commit, rollback, missing-table detection, and FastAPI import. Verified on MySQL: authentication, read-only queries against all three tables, and the detected-objects foreign key. All three tables currently have zero rows.

## D1 and DB2 result — 2026-11-19

- Member 1 approved seven separate waste categories, one per YOLO class, and selected material-inspired UI colors and class-specific treatment guides. The exact values are listed in `docs/API_CONTRACT.md` section 3.
- `database/seed_data.sql` was updated and applied to the existing MySQL database without DROP or DELETE; seven category rows were verified against backend mapping and `ai_training/data.yaml`.
- Frontend category constants, mock category examples, related guide/result text, and the API Contract category list were synchronized. The detection page now displays the API's 422 `detail` message. Endpoint names, HTTP methods, and successful response field structure were not changed.
- An image with no detected class above the confidence threshold will return HTTP 422 with `{ "detail": "Không phát hiện loại rác phù hợp" }` when B3 is implemented.
- Frontend build/lint remains unverified because npm could not remove partially installed `node_modules` directories on Windows (`EPERM`).

## B2 inference result — 2026-11-19

- `backend/app/inference.py` lazily loads the trained YOLOv8s checkpoint, verifies its seven class names and order, and runs inference on image bytes. EXIF orientation is normalized before prediction so pixel boxes match the processed image.
- Detections contain the original YOLO label, matching category key, confidence, pixel `xyxy` box, and category treatment guide. An annotated JPEG is returned in memory for the future prediction endpoint to store.
- A valid image with no detection above the configured threshold raises `NoDetectionError` with the approved Vietnamese message. B3 will map it to HTTP 422.
- Verified against a real 640×640 test image: one detection, valid class/category, confidence and bounded pixel coordinates, and a readable processed JPEG of the same size. A blank image raised `NoDetectionError`. `git diff --check` passed.
- No endpoint, database, or frontend behavior changed in this task. The `torchvision.io` extension warning remains, but inference completed successfully.

## B3 prediction endpoint result — 2026-11-19

- `POST /api/predict` accepts multipart JPEG, PNG, and WEBP files up to 10 MB, runs YOLO, saves original and annotated images, and writes one `detections` row plus every bounding box in `detected_objects` within one database transaction. The highest-confidence box supplies the primary fields.
- The response follows the existing contract, including absolute image URLs, timestamp, all prediction fields, and HTTP 422 for no detection. Failed requests remove any files saved before the failure.
- A real 640×640 test image returned 200 with one `banana-peel` detection; both image URLs served successfully. MySQL contains one detection and one detected object from this test. Unsupported MIME and a blank image returned 422. `python-multipart` was installed in the local venv because it was already declared in `backend/requirements.txt` but missing there.
- No Frontend, schema, or API Contract changes were needed. The Frontend build remains unverified due the previously observed npm `EPERM` issue.

## B4 history result — 2026-11-19

- `GET /api/history` reads the existing MySQL detections with category filtering, literal substring label search, stable sorting, and pagination. `GET /api/history/{id}` returns the prediction-shaped detail with every stored object and its pixel box; missing IDs return 404.
- Verified with the B3 database record: category and search matches/nonmatches, pagination, all three accepted sort values, detail content, invalid query 422, and missing detail 404. Ordering across multiple records remains to be verified when more real scans exist.
- No Frontend, database schema, or API Contract changes. During I1, the Frontend history modal should fetch `/api/history/{id}` on selection because list items intentionally omit `predictions` as specified by the contract.

## B5 dashboard result — 2026-11-19

- `GET /api/dashboard/stats` aggregates persisted detections for total scans, average confidence as a percentage, today's scans, seven category counts and percentages, and the last seven calendar days including today. Category names and colors come from the existing MySQL seed rows.
- Verified against the one B3 test scan: 200 response, one total/today scan, 90.7% average confidence, seven categories with counts summing to one, and seven daily points. The empty-database path handles zero totals in code but was not run against an empty MySQL database to preserve existing data.
- No Frontend, schema, or API Contract changes. I1 should update the stale `5 Nhóm rác chính` heading in `frontend/src/pages/DashboardPage.tsx` to seven categories and fetch history detail for its modal.

## I1 integration progress — 2026-11-19

- Frontend history detail service now converts the existing prediction-shaped detail response into the `HistoryItem` expected by the modal. Selecting a history row fetches `/api/history/{id}`; closing or selecting another row prevents stale responses from replacing the active item.
- The Dashboard heading now says seven waste categories. Detection, history list, and dashboard API calls already matched the live backend routes, so they were not rewritten.
- The incomplete `node_modules` tree caused Windows `EPERM` during npm install. It was moved aside, dependencies were restored with `npm.cmd ci --no-audit --no-fund`, and the old tree was removed after verification. `npm.cmd run build` passes; `npm.cmd run lint` passes with four existing warnings. Browser-level live API verification remains for Q1.

## Q1 end-to-end verification — 2026-11-19

- An actual dataset test image was uploaded through the FastAPI multipart endpoint. The scan returned image URLs and one bounding box, both images were served, the scan appeared under filtered history, detail returned its box, and dashboard total increased from 1 to 2. MySQL retains the two verification scans.
- `frontend/src/services/api.ts` now allows 120 seconds for the prediction POST because the first model load exceeded the previous 30-second timeout. Other API timeouts remain unchanged.
- README now documents PowerShell startup, MySQL/model prerequisites, and switching the Frontend from Demo to Live FastAPI. Frontend production build and `git diff --check` pass. A browser click-through was not performed; the API flow was exercised with FastAPI TestClient and the Frontend was compile-checked.
- Follow-up live HTTP verification used running Vite on port 5173 and Uvicorn on port 8000: Vite served the app, the browser-origin CORS preflight passed, a multipart upload returned scan ID 3 and served both images, History returned the scan and its box, and Dashboard total increased from 2 to 3. Browser tab automation was unavailable because its access host was unavailable; no visual click-through claim is made.

## Multi-object result display — 2026-11-19

- Detection result and history detail now show every returned prediction with its own label, category, confidence, treatment guide, and pixel box. Primary fields and API responses are unchanged.
- Frontend build and lint pass (four existing lint warnings); `git diff --check` passes.
- Dataset label audit found 393 train, 65 validation, and 53 test images with multiple boxes, but zero images with two different class IDs. A read-only synthetic side-by-side banana-peel/metal image produced both labels at confidence above 0.9; real mixed-material photos remain unverified.

## U1 result and U2 proposal — 2026-11-19

- The result screen now has separate `Chọn ảnh mới` and `Xóa khỏi màn hình` actions. Choosing opens a JPEG/PNG/WEBP file picker directly; clearing removes only the current browser view. Both modes preserve any saved history. Frontend production build and `git diff --check` pass.
- U2 proposal at this stage: `DELETE /api/history/{id}` returns `204 No Content` on success and `404 {"detail":"Detection not found"}` for an unknown ID. Delete the MySQL detection (existing foreign key cascades to detected_objects), then remove only its two files under the configured uploads directory. Frontend provides a per-card Delete action with an explicit confirmation and refreshes History/Dashboard data. No database schema change is needed; no existing scan is deleted during implementation tests. Approval and implementation are recorded below.

## U2 deletion result — 2026-11-20

- Member 1 approved the proposed endpoint and deletion of both stored image files. The API Contract now documents `DELETE /api/history/{id}` with 204 and 404 responses.
- Each History card has a Delete button. The browser confirms that the scan, objects, and both saved images will be removed. Mock mode removes the in-memory item; Live mode calls the API, then refreshes the page or moves back one page when the last item was deleted.
- Backend deletes the MySQL detection in a transaction (the existing foreign key cascades to detected objects), then removes only generated files under the expected upload folders. Unsafe stored URLs are skipped, and file cleanup errors are logged.
- Test created and deleted only temporary scan ID 21: response 204 with empty body, child row gone, both files gone, dashboard count 21 to 20, and subsequent detail/delete returned 404. Existing scans were not deleted. Frontend build, lint, Python compile, and `git diff --check` passed; lint retained three unrelated warnings.

## Detection quick samples — 2026-11-20

- Replaced four unrelated remote Unsplash photos with local copies of four labeled images from the existing Roboflow test split: plastic bottle, paper envelope, metal can, and banana peel. The original dataset files were not changed.
- All four JPEGs passed image validation and were included under `dist/samples` in the Frontend production build. Build, lint, and `git diff --check` passed; lint retained three unrelated warnings.
- The current Python environment raised `RuntimeError: operator torchvision::nms does not exist` during attempted fresh model validation. The selected images are visually relevant and match dataset label files, but this turn did not verify each image's live YOLO prediction.
