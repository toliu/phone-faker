import * as React from "react";

import {Message} from "./messages";
import {MineText, OtherText} from "./messages/text";
import {MineVoice, OtherVoice} from "./messages/voice";
import {FixedPhone} from "../../phone/fixedphone";

import styles from "./assets/css/fixedchat.module.css";

import defaultAvatar from "./assets/img/default_avatar.png";
import {VoiceInput} from "./voice_input";

enum inputType {
    voice = "voice",
    emoji = "emoji",
    addition = "addition",
}

interface ChatProps {
    user?: {
        name: string;
        avatar?: string;
    };
    otherUser?: {
        name: string;
        avatar?: string;
    };
    messages?: Message[];
}

interface ChatStats {
    user: {
        name: string;
        avatar: string;
    };
    otherUser: {
        name: string;
        avatar: string;
    };
    bottomInput?: inputType;
    messages: Message[];
}

export class FixedChat extends React.Component<ChatProps, ChatStats> {
    private bodyRef: any;
    private textInputRef: any;

    private currentInputText: string;

    constructor(props: ChatProps) {
        super(props);

        this.getControllerPanel = this.getControllerPanel.bind(this);
        this.getControllerInput = this.getControllerInput.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.inputText = this.inputText.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);

        const defaultUser = {
            name: "时光",
            avatar: defaultAvatar,
        };
        this.currentInputText = "";

        this.state = {
            user: {
                name: this.props.user ? this.props.user.name : defaultUser.name,
                avatar: this.props.user && this.props.user.avatar ? this.props.user.avatar : defaultUser.avatar,
            },
            otherUser: {
                name: this.props.otherUser ? this.props.otherUser.name : defaultUser.name,
                avatar: this.props.otherUser && this.props.otherUser.avatar ? this.props.otherUser.avatar : defaultUser.avatar,
            },
            bottomInput: undefined,
            messages: this.props.messages ? this.props.messages : [],
        }
    }

    public componentDidUpdate() {
        this.bodyRef.scrollTop = this.bodyRef.scrollHeight;
    }

    public render(): React.ReactElement {
        const chatName: string = this.state.otherUser.name;
        const bodyClassName: string = this.state.bottomInput ? styles.body : styles["body-no-input"];

        return (
            <FixedPhone
                controllerPanel={this.getControllerPanel()}
                controllerInput={this.getControllerInput()}
            >
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
                    {this.state.messages.map((msg: Message, index: number) => {
                        const od = this.deleteMessage(index);
                        switch (msg.kind) {
                            case "text":
                                return msg.user === this.state.user.name ?
                                    <MineText avatarURL={msg.avatar}
                                              content={msg.content}
                                              key={index}
                                              onDelete={od}/>
                                    : <OtherText avatarURL={msg.avatar}
                                                 content={msg.content}
                                                 key={index}
                                                 onDelete={od}/>;
                            case "voice":
                                return msg.user === this.state.user.name ?
                                    <MineVoice avatarURL={msg.avatar}
                                               length={msg.voice}
                                               key={index}
                                               onDelete={od}/> :
                                    <OtherVoice avatarURL={msg.avatar}
                                                length={msg.voice}
                                                key={index}
                                                onDelete={od}/>
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
            this.setState({messages: messages})
        }
    }

    private sendMessage(msg: Message) {
        const messages = this.state.messages;
        messages.push(msg);
        this.setState({
                messages: messages
            }
        )
    }

    private inputText(e: any) {
        if (e.keyCode === 13) {
            this.textInputRef.value = "";
            if (this.currentInputText) {
                this.sendMessage({
                    kind: "text", user: this.state.user.name,
                    avatar: this.state.user.avatar, content: this.currentInputText,
                });
                this.currentInputText = "";
            }
        } else if (e.target) {
            this.currentInputText = e.target.value;
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
                                user: this.state.user.name,
                                avatar: this.state.user.avatar,
                                voice: v,
                            })
                        }}/>
                    </InputPanel>
                );
            case inputType.emoji:
                return (
                    <InputPanel onBack={back}>
                        Emoji
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

