import { useEffect, useRef, useState } from 'react'
import { Tldraw, loadSnapshot }  from '@tldraw/tldraw'
import {
    initYorkie,
    subscribeToDoc,
    updateSnapshot,
    getActiveUsers,
    subscribeToPresence,
} from '../../services/yorkieService'
import "../../style/Whiteboard.css";
import profile from "../../assets/profile.jpg"

function Whiteboard({teamId, me}) {
    const editorRef  = useRef(null);
    const yorkieDoc  = useRef(null);
    const boardId = teamId === null ? `board${me.nickname}`: `team${teamId}`;
    const [activeUsers, setActiveUsers] = useState([]); 
    const myPresence = {
            nickname: me.nickname,
            img: me.profileImageUrl
        };
        
    

    /*──────────────── Yorkie 연결 ────────────────*/
    useEffect(() => {
        console.log(boardId)
        if (!me || !me.nickname) return;
        let interValid = null;

        (async () => {
            const { doc, clientID } = await initYorkie(boardId || 'root', myPresence);
            yorkieDoc.current = doc;
            
            // 내 presence 바로 set
            doc.update((root, presence) => {
            presence.set(myPresence);
            });

            // 초기 유저 목록 강제 갱신
            updateActiveUsers(getActiveUsers(doc))


            let isInitialLoaded = false

            subscribeToDoc(doc, clientID, (snap) => {
                const editor = editorRef.current
                if (!editor) return

                try {
                    const currentSnap = JSON.stringify(editor.store.getSnapshot())
                    const newSnap = JSON.stringify(snap)

                    if (currentSnap !== newSnap) {
                    loadSnapshot(editor.store, snap)
                    console.log('[스냅샷 동기화 완료]', snap)
                    }

                    if (!isInitialLoaded) {
                    isInitialLoaded = true
                    console.log('[초기 스냅샷 수신 완료]')
                    }
                } catch (err) {
                    console.error('[스냅샷 비교 오류]', err)
                }
            })

            
            // presence가 바뀔때 호출
            subscribeToPresence(doc, () => {
                const users = getActiveUsers(doc);
                updateActiveUsers(users);
            })

            // 주기적으로 강제 갱신
            interValid = setInterval(() => {
                if (doc) {
                    const users = getActiveUsers(doc);
                    updateActiveUsers(users);
                }
            }, 5000)  // 5초마다 확인
        })()

        // 중복 제거 후 상태 업데이트
        function updateActiveUsers(users) {
            const uniqueUsers = [];
            const seenNicknames = new Set();

            for (const user of users) {
                const nickname = user.presence?.nickname || "";
                if (!nickname.trim() || seenNicknames.has(nickname)) continue
                seenNicknames.add(nickname);
                uniqueUsers.push(user);
            }

            // 내 presence를 맨 앞에 표시
            uniqueUsers.sort((a, b) =>
                a.presence?.nickname === me.nickname ? -1 : 1
            )

            setActiveUsers(uniqueUsers);
        }

        /* unmount 시 문서 Detach → 즉시 flush */
        return () => {
            clearInterval(interValid);  // 타이머 정리
            yorkieDoc.current?.detach?.();
        }
    }, [teamId, me])

    /*───────── 에디터 mount 후 초기 스냅샷 불러오기 및 변경 감지 ─────────*/
    const handleMount = (editor) => {
        editorRef.current = editor

        let tries = 0
        const maxTries = 20  // 최대 2초 (20 * 100ms)

        const waitForYorkie = setInterval(() => {
            if (yorkieDoc.current) {
            try {
                const raw = yorkieDoc.current.getRoot().snapshot
                if (raw) {
                const parsed = JSON.parse(raw)
                loadSnapshot(editor.store, parsed)
                console.log('[초기 스냅샷 불러옴]', parsed)
                clearInterval(waitForYorkie)
                } else {
                console.log('[스냅샷 없음] 기다리는 중...')
                }
            } catch (err) {
                console.error('[초기 스냅샷 파싱 오류]', err)
                clearInterval(waitForYorkie)
            }
            }

            tries++
            if (tries > maxTries) {
            console.warn('[스냅샷 없음] 일정 시간 대기 후 중단')
            clearInterval(waitForYorkie)
            }
        }, 100)

        let timer
        editor.store.listen(() => {
            if (!yorkieDoc.current) return
            clearTimeout(timer)
            timer = setTimeout(() => {
            try {
                const snap = editor.store.getSnapshot()
                updateSnapshot(yorkieDoc.current, snap)
                console.log('[스냅샷 저장됨]', snap)
            } catch (err) {
                console.error('[스냅샷 저장 오류]', err)
            }
            }, 500)
        })
        }


    return (
        <div
            style={{
                width:"100%",
                height:"580px",
                display:"flex"
            }}
        >
            <div style={{width:"60px", marginRight:"15px", marginTop:"5px", display:"flex", flexDirection:"column", gap:"10px"}}>
                {activeUsers.map((user, index)=>
                <img className="Memberimg" key={index} src = {user.presence.img===null ? profile : user.presence.img} alt="user_img"></img>
                )}
            </div>
            <Tldraw onMount={handleMount} />
        </div>
    )
} export default Whiteboard;