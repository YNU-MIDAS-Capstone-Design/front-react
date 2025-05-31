import { useEffect, useRef, useState, useMemo } from 'react'
import { Tldraw, loadSnapshot }  from '@tldraw/tldraw'
import { useParams, useLocation } from 'react-router-dom';
import 'tldraw/tldraw.css'
import {
    initYorkie,
    subscribeToDoc,
    updateSnapshot,
    getActiveUsers,
    subscribeToPresence,
} from '../../services/yorkieService'
import "../../style/Whiteboard.css";
import profile from "../../assets/profile.jpg"

function Whiteboard() {
    const { teamId } = useParams();
    const location = useLocation();
    const me = location.state?.me;

    const editorRef  = useRef(null);
    const yorkieDoc  = useRef(null);
    const clientRef  = useRef(null);
    const docRef     = useRef(null);  // doc (for cleanup)
    
    const [snapshotLoaded, setSnapshotLoaded] = useState(false);
    const [activeUsers, setActiveUsers] = useState([]);

    const myPresence = useMemo(() => ({
        nickname: me.nickname,
        img: me.profileImageUrl
    }), [me.nickname, me.profileImageUrl]);
        
    const docKey = `team-${teamId}`

    /*──────────────── Yorkie 연결 ────────────────*/
    useEffect(() => {
        if (!me || !me.nickname) return;
        let interValid = null;
        let mounted = true;

        const handleUnload = () => {
            const client = clientRef.current;
            const doc = docRef.current;
            if (client && doc) {
                try {
                    client.detach(doc);
                    client.deactivate();
                    console.log('[정리 완료] Yorkie detach + deactivate');
                } catch (err) {
                    console.warn('[정리 실패]', err);
                }
            }
        };

        (async () => {
            const { doc, client, clientID } = await initYorkie(docKey, myPresence);
            if (!mounted) return;

            yorkieDoc.current = doc;
            clientRef.current = client;
            docRef.current = doc;
            
            // 내 presence 바로 set
            doc.update((root, presence) => {
                presence.set(myPresence);
            });

            // 초기 유저 목록 강제 갱신
            updateActiveUsers(getActiveUsers(doc))


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

                    // snapshot과 함께 사용자도 갱신
                    const users = getActiveUsers(doc);
                    updateActiveUsers(users);

                } catch (err) {
                    console.error('[스냅샷 비교 오류]', err)
                }
            })

            // Yorkie 연결 후 실시간 사용자 접속/퇴장 감지
            client.onPeersChanged = () => {
            if (!mounted) return;
            const users = getActiveUsers(doc);
            console.log('[Peers 변경 감지됨]', users);
            updateActiveUsers(users);
            };
            
            // presence가 변경 감지
            subscribeToPresence(doc, () => {
                if (!mounted) return;
                const users = getActiveUsers(doc);
                console.log('[Presence 변경 감지됨] 현재 사용자:', users);
                updateActiveUsers(users);
            })

            // 주기적으로 강제 갱신
            interValid = setInterval(() => {
                if (doc&&mounted) {
                    const users = getActiveUsers(doc);
                    updateActiveUsers(users);
                }
            }, 2000)  // 2초마다 확인
 
            // beforeunload에 이벤트 리스너 등록
            window.addEventListener('beforeunload', handleUnload);
        })()

        // 중복 제거 후 상태 업데이트
        function updateActiveUsers(users) {
             const activeOnly = users.filter(user => user.isActive !== false);

            const uniqueUsers = [];
            const seenNicknames = new Set();

            for (const user of activeOnly) {
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
            mounted = false;
            window.removeEventListener('beforeunload', handleUnload);
            clearInterval(interValid);  // 타이머 정리
            handleUnload();
            yorkieDoc.current = null;
            clientRef.current = null;
            docRef.current = null;
        }
    }, [docKey, me, myPresence])

    /*─────────  라우트 변경 시에도 연결 정리 ─────────*/
    useEffect(() => {
        return () => {
            console.log('[라우팅 변경 감지] Yorkie 연결 정리');
            const client = clientRef.current;
            const doc = docRef.current;
            if (client && doc) {
                try {
                    client.detach(doc);
                    client.deactivate();
                    console.log('[라우트 정리 완료]');
                } catch (err) {
                    console.warn('[라우트 정리 실패]', err);
                }
            }
            yorkieDoc.current = null;
            clientRef.current = null;
            docRef.current = null;
        }
    }, [location.pathname]);

    /*───────── 에디터 mount 후 초기 스냅샷 불러오기 및 변경 감지 ─────────*/
    const handleMount = (editor) => {
        editorRef.current = editor;

        const maxTries = 20;  // 최대 시도 횟수 (2초)
        const intervalMs = 100; // 재시도 간격

        const tryLoadSnapshot = (tries = 0) => {
            const maxReloads = 3;
            const reloadKey = `reloadCount-${teamId}`; // teamId마다 개별 카운팅

            const handleMaxRetry = () => {
                const currentCount = parseInt(sessionStorage.getItem(reloadKey) || '0', 10);
                if (currentCount < maxReloads) {
                    sessionStorage.setItem(reloadKey, (currentCount + 1).toString());
                    console.warn(`[재시도 ${currentCount + 1}회] 새로고침 시도`);
                    window.location.reload();
                } else {
                    alert("로딩에 반복 실패했습니다. 나중에 다시 시도해 주세요.");
                    sessionStorage.removeItem(reloadKey); // 실패 후 리셋
                }
            };

            if (!yorkieDoc.current) {
                if (tries < maxTries) {
                    setTimeout(() => tryLoadSnapshot(tries + 1), intervalMs);
                } else {
                    console.warn('[스냅샷 없음] 최대 시도 초과');
                    handleMaxRetry();
                }
                return;
            }

            // Whiteboard 컴포넌트 내부, handleMount 함수 중 tryLoadSnapshot 수정
            try {
                const raw = yorkieDoc.current.getRoot().snapshot;
                if (raw && !snapshotLoaded) {
                    const parsed = JSON.parse(raw);
                    loadSnapshot(editor.store, parsed);
                    console.log('[초기 스냅샷 불러옴]', parsed);
                } else {
                    console.log('[스냅샷 없음] 빈 보드로 시작합니다.');
                }

                // ✅ 이 부분을 공통으로 이동 → snapshot 여부 상관없이 loaded 처리
                setSnapshotLoaded(true);
                sessionStorage.removeItem(reloadKey);
            } catch (err) {
                console.error('[초기 스냅샷 파싱 오류]', err);
                handleMaxRetry(); // ❗ 파싱 실패는 새로고침 필요
            }

        };


        tryLoadSnapshot();

        let timer;
        editor.store.listen(() => {
            if (!yorkieDoc.current) return;
            clearTimeout(timer);
            timer = setTimeout(() => {
                try {
                    const snap = editor.store.getSnapshot();
                    updateSnapshot(yorkieDoc.current, snap);
                } catch (err) {
                    console.error('[스냅샷 저장 오류]', err);
                }
            }, 500);
        });
    };


    return (
        <div
            style={{
                width:"100%",
                height:"650px",
                display:"flex"
            }}
        >
            <Tldraw onMount={handleMount} />
            {!snapshotLoaded && (
                <div
                    style={{
                        position: "absolute",
                        top: 80,
                        left: 0,
                        width: "100%",
                        height: "650px",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "18px",
                    }}
                >
                    <section className="loading_round">
                        <div></div>
                        <div></div>
                        <div></div>
                    </section>
                </div>
            )}
            <div style={{width:"40px", padding:"8px", display:"flex", flexDirection:"column", gap:"5px", background:"rgb(249, 250, 251)"}}>
                {activeUsers.map((user, index)=>
                <img className="Memberimg" key={index} src = {user.presence.img===null ? profile : user.presence.img} alt="user_img" title={user.presence.nickname}></img>
                )}
            </div>

            </div>
    )
} export default Whiteboard;