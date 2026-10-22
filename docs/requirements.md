when
When the user selects a folder, the system shall display its files and subfolders.

WHILE
While a folder is loading, the system shall display a loading indicator.

. IF… THEN
If the user denies folder access, then the system shall display an access-denied message.

TESTS

Test 1 — Folder Selection (WHEN)

Input: A folder containing 3 files and 2 subfolders.

Action: The user selects the folder.

Expected Result: The system displays all 3 files and 2 subfolders.

Test 2 — Folder Loading (WHILE)

Input: A folder with a simulated loading delay.

Action: The user opens the folder.

Expected Result: A loading indicator is displayed while the folder is loading and disappears when loading completes.

Test 3 — Access Denied (IF…THEN)

Input: A folder that requires user permission.

Action: The user denies access to the folder.

Expected Result: The system displays an "Access Denied" message without crashing.
