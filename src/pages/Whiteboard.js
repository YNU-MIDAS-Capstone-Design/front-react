import React, { useEffect, useRef } from 'react'
import { useParams }             from 'react-router-dom'
import { Tldraw, loadSnapshot }  from '@tldraw/tldraw'
import {
    initYorkie,
    subscribeToDoc,
    updateSnapshot,
} from '../services/yorkieService'

export default function Whiteboard() {
    const { boardId } = useParams()          // URL ↔ 문서 키
    const editorRef  = useRef(null)
    const yorkieDoc  = useRef(null)

    /* 헤더·푸터 높이를 빼고 전체 채우기 */
    const HEADER = document.querySelector('header')?.offsetHeight || 0
    const FOOTER = document.querySelector('footer')?.offsetHeight || 0

    /*──────────────── Yorkie 연결 ────────────────*/
    useEffect(() => {
        (async () => {
            const { doc, clientID } = await initYorkie(boardId || 'root')
            yorkieDoc.current = doc

            /* ① 서버에 저장돼 있던 스냅숏을 처음 한 번 로드 */
            const raw = doc.getRoot().snapshot
            if (raw && editorRef.current) {
                loadSnapshot(editorRef.current.store, JSON.parse(raw))
            }

            /* ② 원격 변경 → 전체 스냅숏 재로드(동기화) */
            subscribeToDoc(doc, clientID, snap => {
                const editor = editorRef.current
                if (!editor) return

                /* 이미 같은 스냅숏이면 무시 */
                if (
                    JSON.stringify(editor.store.getSnapshot()) ===
                    JSON.stringify(snap)
                ) return

                loadSnapshot(editor.store, snap)   // 깜빡임 없이 전체 반영
            })
        })()

        /* unmount 시 문서 Detach → 즉시 flush */
        return () => yorkieDoc.current?.detach?.()
    }, [boardId])

    /*───────── 에디터 mount & 변화 감지 ─────────*/
    const handleMount = editor => {
        editorRef.current = editor

        /* mount 직후 문서 준비될 때까지 기다렸다가 1회 저장 */
        const wait = setInterval(() => {
            if (yorkieDoc.current) {
                updateSnapshot(yorkieDoc.current, editor.store.getSnapshot())
                clearInterval(wait)
            }
        }, 50)

        /* 변경 → 500 ms 디바운스로 스냅숏 저장 */
        let timer
        editor.store.listen(() => {
            if (!yorkieDoc.current) return
            clearTimeout(timer)
            timer = setTimeout(() => {
                updateSnapshot(yorkieDoc.current, editor.store.getSnapshot())
            }, 500)
        })
    }

    /*───────── UI 레이아웃 ─────────*/
    return (
        <div
            style={{
                position: 'fixed',
                top: HEADER,
                bottom: FOOTER,
                left: 0,
                right: 0,
            }}
        >
            <Tldraw onMount={handleMount} />
        </div>
    )
}
