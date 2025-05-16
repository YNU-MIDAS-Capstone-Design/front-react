import * as yorkie from 'yorkie-js-sdk'

/*──────────────── Yorkie 문서 연결 ────────────────*/
export async function initYorkie(docKey = 'root') {
    const client = new yorkie.Client('http://localhost:8080')
    await client.activate()                   // 내부 sync-loop 자동 수행

    const doc = new yorkie.Document(docKey)   // ← 보드 ID == 문서 키
    await client.attach(doc)

    /* 스냅숏 필드가 없으면 초기화 */
    doc.update(r => {
        if (!r.snapshot) r.snapshot = null      // 문자열로 저장
    })

    return { client, doc, clientID: client.getID() }
}

/*───────── 원격 스냅숏 수신(내 ID 제외) ─────────*/
export function subscribeToDoc(doc, myID, onSnap) {
    doc.subscribe(ev => {
        if (ev.type === 'remote-change' && ev.publisher !== myID) {
            const raw = doc.getRoot().snapshot
            if (raw) onSnap(JSON.parse(raw))
        }
    })
}

/*───────── 로컬 스냅숏 저장 ─────────*/
export function updateSnapshot(doc, snapObj) {
    const next = JSON.stringify(snapObj)
    if (doc.getRoot().snapshot === next) return   // 내용 동일 ➜ skip
    doc.update(r => {
        r.snapshot = next
    })
    /* 별도 doc.sync() 호출 필요 없음(자동 loop) */
}
