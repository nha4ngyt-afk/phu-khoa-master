let database: Promise<IDBDatabase> | null = null;
export function openDB() {
  return (database ??= new Promise<IDBDatabase>((resolve, reject) => {
    const r = indexedDB.open("phu-khoa-master", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("records");
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => {
      database = null;
      reject(Error("Không mở được bộ nhớ trên thiết bị."));
    };
    r.onblocked = () =>
      reject(
        Error("Bộ nhớ đang bị chặn. Hãy đóng tab Phụ khoa khác và thử lại."),
      );
  }));
}
export async function read<T>(key: string, fallback: T): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction("records", "readonly"),
      r = t.objectStore("records").get(key);
    r.onsuccess = () => resolve(r.result === undefined ? fallback : r.result);
    r.onerror = () => reject(r.error);
  });
}
export async function write(key: string, value: unknown) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const t = db.transaction("records", "readwrite");
    t.objectStore("records").put(value, key);
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error ?? Error("Không thể lưu dữ liệu."));
  });
}
export async function atomic(values: Record<string, unknown>) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const t = db.transaction("records", "readwrite");
    for (const [k, v] of Object.entries(values))
      t.objectStore("records").put(v, k);
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error ?? Error("Không lưu được bài."));
  });
}
export async function clearDB() {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const t = db.transaction("records", "readwrite");
    t.objectStore("records").clear();
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
  });
}
