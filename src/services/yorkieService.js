import * as yorkie from 'yorkie-js-sdk'

/*──────────────── Yorkie 문서 연결 ────────────────*/
export async function initYorkie(docKey = 'root', myPresence = {}) {
    const client = new yorkie.Client('http://localhost:8081')
    await client.activate()                   // 내부 sync-loop 자동 수행

    const doc = new yorkie.Document(docKey)   // ← 보드 ID == 문서 키
    // presence 설정
    await client.attach(doc, {
        initialPresence: myPresence
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

/*───────── presence 변경 감지 구독 ─────────*/
export function subscribeToPresence(doc, onPresenceChange) {
  doc.subscribe(event => {
    if (event.type === 'presence-changed') {
      const { clientID, presence } = event;
      onPresenceChange(clientID, presence);
    }
  });
}

/*───────── 접속자 목록 확인하기 ─────────*/
export function getActiveUsers(doc) {
  const presences = doc.getPresences(); // Map(clientID → presence 객체)
  const users = [];

  presences.forEach((presence, clientID) => {
    users.push({
      clientID,
      ...presence, // nickname, color 등 확장된 정보 포함 가능
    });
  });

  return users;
}