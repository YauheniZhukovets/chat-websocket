import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import s from './App.module.scss'


type UserType = {
    userId: number
    userName: string
    photo: string
    message: string
}

export const App = () => {

    const scrollSpan = useRef<HTMLSpanElement | null>(null);
    const [ws, setWs] = useState<WebSocket | null>(null)
    const [text, setText] = useState<string>('')
    const [users, setUsers] = useState<Array<UserType>>([])
    const numbersUsers = new Set(users.map(u => u.userId))

    if (ws) {
        ws.onmessage = (messageEvent: MessageEvent) => {
            const data = JSON.parse(messageEvent.data)
            setUsers([...users, ...data])
        }
    }

    useEffect(() => {
        const localWs = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx')
        setWs(localWs)
    }, [])

    useEffect(() => {
        if (scrollSpan) {
            scrollSpan.current?.scrollIntoView({behavior: 'smooth'})
        }

    }, [users]);

    const onClickSendMessageHandler = () => {
        if (ws) {
            ws.send(text)
            setText('')
        }
    }

    const onChangeTextareaMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.currentTarget.value)
    }

    return (
        <div className={s.App}>
            <div className={s.chat}>
                <div className={s.header}>
                    <div>Welcome to the Chat Flood Room</div>
                </div>
                <div className={s.dialogs}>
                    {users.map((u, index) => <div key={index} className={s.message}>
                        <div className={s.photoWrapper}><img className={s.photo} src={u.photo} alt={'icon'}/></div>
                        <span className={s.name}>{u.userName}</span>
                        <div className={s.text}>{u.message}</div>
                    </div>)
                    }
                    <span ref={scrollSpan}></span>
                </div>
                <div className={s.questionBox}>
                    <div className={s.textBox}>
                        <textarea className={s.textArea}
                                  value={text}
                                  onChange={onChangeTextareaMessage}
                                  placeholder={'Enter text message'}
                        />
                    </div>
                    <div className={s.buttonContainer}>
                        <button className={s.sendButton}
                                disabled={text.length === 0}
                                onClick={onClickSendMessageHandler}
                        >
                            Send message
                        </button>
                        <span className={s.numbersUsers}>Number of users: <b> {numbersUsers.size}</b></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

