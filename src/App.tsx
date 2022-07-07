import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import './App.css';

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
        <div className="App">
            <div className={'chat'}>
                <div className={'users'}>
                    {users.map((u, index) => <div key={index} className={'message'}>
                        <img className={'photo'} src={u.photo} alt={'icon'}/>
                        <b>{u.userName}</b>
                        <span>{u.message}</span>
                    </div>)
                    }
                    <span ref={scrollSpan}></span>
                </div>
                <div className={'footer'}>
                    <textarea value={text} onChange={onChangeTextareaMessage}
                              placeholder={'Enter text message'}></textarea>
                    <button onClick={onClickSendMessageHandler}>send message</button>
                </div>
            </div>
        </div>
    )
}

