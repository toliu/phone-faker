import * as React from "react";
import {EmojiInput} from "./emoji_input";
import {MessageType} from "./messages";
import {MineText, OtherText} from "./messages/text";
import {MineVoice, OtherVoice} from "./messages/voice";
import {FixedPhone} from "../../phone/fixedphone";

import styles from "./assets/css/fixedchat.module.css";

import {VoiceInput} from "./voice_input";

enum inputType {
    voice = "voice",
    emoji = "emoji",
    addition = "addition",
}

interface ChatProps {
    userName: string;
    userAvatar: string;
    otherUserName: string;
    otherUserAvatar: string;
    sender?: (m: MessageType[]) => void;
    messages?: MessageType[];
}

interface ChatStats {
    currentInputText: string;
    bottomInput?: inputType;
    messages: MessageType[];
}

export class FixedChat extends React.Component<ChatProps, ChatStats> {
    private bodyRef: any;
    private textInputRef: any;

    constructor(props: ChatProps) {
        super(props);

        this.getControllerPanel = this.getControllerPanel.bind(this);
        this.getControllerInput = this.getControllerInput.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.inputText = this.inputText.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);
        this.changeBodyBackground = this.changeBodyBackground.bind(this);

        this.state = {
            bottomInput: undefined,
            currentInputText: "",
            messages: this.props.messages ? this.props.messages : [],
        }
    }

    public componentDidUpdate() {
        this.bodyRef.scrollTop = this.bodyRef.scrollHeight;
    }

    public render(): React.ReactElement {
        const chatName: string = this.props.otherUserName;
        const bodyClassName: string = this.state.bottomInput ? styles.body : styles["body-no-input"];

        return (
            <FixedPhone controllerPanel={this.getControllerPanel()} controllerInput={this.getControllerInput()}>
                <div className={styles.header}>
                    <div className={styles.back}>
                    </div>
                    <div className={styles.name}>
                        {chatName}
                    </div>
                    <div className={styles.profile}>
                    </div>
                </div>
                <div className={bodyClassName} ref={(e) => this.bodyRef = e}>
                    {this.state.messages.map((msg: MessageType, index: number) => {
                        const od = this.deleteMessage(index);
                        switch (msg.kind) {
                            case "text":
                                return msg.user === this.props.userName ?
                                    <MineText avatarURL={msg.avatar} key={index} onDelete={od}>
                                        {msg.content}
                                    </MineText>
                                    : <OtherText avatarURL={msg.avatar} key={index} onDelete={od}>
                                        {msg.content}
                                    </OtherText>;
                            case "voice":
                                return msg.user === this.props.userName ?
                                    <MineVoice avatarURL={msg.avatar}
                                               length={msg.voice}
                                               key={index}
                                               onDelete={od}/> :
                                    <OtherVoice avatarURL={msg.avatar}
                                                length={msg.voice}
                                                key={index}
                                                onDelete={od}/>;
                            default:
                                return <MineText avatarURL={this.props.userAvatar} onDelete={od}>未知类型</MineText>;
                        }
                    })}
                </div>
            </FixedPhone>
        );
    }

    private getControllerPanel(): React.ReactElement {
        return (
            <div className={styles.panel}>
                <div className={styles.voice} onClick={() => this.setState({bottomInput: inputType.voice})}>

                </div>
                <input
                    className={styles.input}
                    type={"text"}
                    ref={(e) => this.textInputRef = e}
                    autoFocus={true}
                    onChange={this.inputText}
                    onKeyUp={this.inputText}
                    value={this.state.currentInputText}
                />
                <div className={styles.emoji} onClick={() => this.setState({bottomInput: inputType.emoji})}>

                </div>

                <div className={styles.addition} onClick={() => this.setState({bottomInput: inputType.addition})}>

                </div>
            </div>
        );
    }

    private deleteMessage(index: number): () => void {
        return () => {
            const messages = this.state.messages;
            messages.splice(index, 1);
            if (this.props.sender) {
                this.props.sender(messages);
            }
            this.setState({messages: messages})
        }
    }

    private sendMessage(msg: MessageType) {
        const messages = this.state.messages;
        messages.push(msg);
        if (this.props.sender) {
            this.props.sender(messages);
        }
        this.setState({
                currentInputText: "",
                messages: messages,
            }
        )
    }

    private inputText(e: any) {
        if (e.keyCode === 13) {
            this.textInputRef.value = "";
            if (this.state.currentInputText) {
                this.sendMessage({
                    kind: "text", user: this.props.userName,
                    avatar: this.props.userAvatar, content: this.state.currentInputText,
                });
            }
        } else if (e.target) {
            this.setState({
                currentInputText: e.target.value
            });
        }
    }

    private getControllerInput(): React.ReactElement | void {
        const back = () => {
            this.setState({bottomInput: undefined})
        };

        switch (this.state.bottomInput) {
            case inputType.voice:
                return (
                    <InputPanel onBack={back}>
                        <VoiceInput onSubmit={(v: number) => {
                            this.sendMessage({
                                kind: "voice",
                                user: this.props.userName,
                                avatar: this.props.userAvatar,
                                voice: v,
                            })
                        }}/>
                    </InputPanel>
                );
            case inputType.emoji:
                return (
                    <InputPanel onBack={back}>
                        <EmojiInput onSelect={(e: string) => {
                            this.setState({currentInputText: this.state.currentInputText + e})
                        }}/>
                    </InputPanel>
                );
            case inputType.addition:
                return (
                    <InputPanel onBack={back}>
                        Addition
                    </InputPanel>
                );
        }
    }

    private changeBodyBackground() {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            this.bodyRef.style.background = "url(" + url + ") no-repeat";
            this.bodyRef.style.backgroundSize = "277px 100%";
            input.remove();
        }
    }
}

class InputPanel extends React.Component<{
    onBack: () => void
}, {}> {
    public render(): React.ReactElement {
        return (
            <div className={styles["input-panel"]}>
                <div className={styles.child}>
                    {this.props.children}
                </div>
                <div className={styles.back} title={"返回"} onClick={this.props.onBack}>

                </div>
            </div>
        );
    }
}

