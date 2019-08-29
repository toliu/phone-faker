import * as React from "react";
import html2canvas from "html2canvas";

import {Phone} from "../../phone/phone";
import {DateTime} from "./messages/date";
import {Image} from "./messages/image";
import {Text} from "./messages/text";
import {Voice} from "./messages/voice";


import styles from "./assets/css/chat.module.css"

import bottomInputBackPicture from "./assets/img/bottom_input_back.png";
import bottomImgUploadPicture from "./assets/img/img_upload.png";
import bottomTimeAppendPicture from "./assets/img/time_append.png";

enum bottomInputType {
    Voice,
    Input,
    Addition,
}

export interface message {
    // common
    mine?: boolean;
    avatarURL?: string;

    // text message
    isText?: boolean;
    content?: string;

    // image message
    isImage?: boolean;
    imagePath?: string;

    // date message
    isDate?: boolean;
    date?: Date;

    //voice message
    isVoice?: boolean;
    voiceLength?: number;
}

interface ChatProps {
    user?: string;
    newMsgRecipient?: (msg: message[]) => void;
    messages: message[];
    myAvatarURL?: string;
    otherAvatarURL?: string;
}

interface ChatStats {
    showBottomInputPanel: boolean;
    bottomPanelType?: bottomInputType;
}

export class Chat extends React.Component<ChatProps, ChatStats> {
    private chatBody: any;

    constructor(props: ChatProps) {
        super(props);

        this.sendMessage = this.sendMessage.bind(this);
        this.toggleBottomInputPanel = this.toggleBottomInputPanel.bind(this);
        this.getVoiceInputElement = this.getVoiceInputElement.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);
        this.getInputElement = this.getInputElement.bind(this);
        this.getAdditionElement = this.getAdditionElement.bind(this);
        this.chatSnapshot = this.chatSnapshot.bind(this);

        this.state = {
            showBottomInputPanel: false,
        };
    }

    componentDidUpdate() {
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
    }

    public render(): React.ReactElement {
        let chatName = this.props.user;
        if (!chatName) {
            chatName = "时光"
        }
        return (
            <Phone button={{text: "截图", onClick: this.chatSnapshot}}>
                <div className={styles.header}>
                    <span className={styles["back-icon"]}/>
                    <span className={styles["chat-name"]}>{chatName}</span>
                    <span className={styles.profile}/>
                </div>
                <div className={styles.body} ref={(chatBody) => this.chatBody = chatBody}>
                    {this.props.messages.map((msg: message, index: number) => {
                        if (!msg.mine) {
                            msg.mine = false;
                        }
                        const avatarURL = msg.mine ? this.props.myAvatarURL : this.props.otherAvatarURL;

                        if (msg.isText) {
                            if (!msg.content) {
                                msg.content = "Nothing"
                            }
                            return <Text mine={msg.mine} content={msg.content} avatarURL={avatarURL} key={index}
                                         onDelete={this.deleteMessage(index)}/>;
                        } else if (msg.isImage) {
                            if (!msg.imagePath) {
                                msg.imagePath = "data:image/jpeg;base64,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"
                            }
                            return <Image mine={msg.mine} imagePath={msg.imagePath} avatarURL={avatarURL}
                                          key={index} onDelete={this.deleteMessage(index)}/>
                        } else if (msg.isDate) {
                            return <DateTime date={msg.date} key={index} onDelete={this.deleteMessage(index)}/>
                        } else if (msg.isVoice) {
                            return <Voice vLength={msg.voiceLength} mine={msg.mine} avatarURL={avatarURL}
                                          key={index} onDelete={this.deleteMessage(index)}/>
                        }
                        return <Text mine={true} content={"Nothing"} key={index} onDelete={this.deleteMessage(index)}/>
                    })}
                </div>
                <div className={styles.bottom + (this.state.showBottomInputPanel ? " " + styles["bottom-rotate"] : "")}>
                    <div className={styles["bottom-bar"]}>
                        <div className={styles.voice} onClick={this.toggleBottomInputPanel(bottomInputType.Voice)}/>
                        <div className={styles.input} onClick={this.toggleBottomInputPanel(bottomInputType.Input)}/>
                        <div className={styles.addition}
                             onClick={this.toggleBottomInputPanel(bottomInputType.Addition)}/>
                    </div>

                    <div className={styles["bottom-input"]}>
                        <div className={styles.bar}>
                            {this.state.bottomPanelType === bottomInputType.Voice ? this.getVoiceInputElement() : ""}
                            {this.state.bottomPanelType === bottomInputType.Input ? this.getInputElement() : ""}
                            {this.state.bottomPanelType === bottomInputType.Addition ? this.getAdditionElement() : ""}
                        </div>
                        <div className={styles.back} onClick={this.toggleBottomInputPanel()}>
                            <img src={bottomInputBackPicture} alt={"back"}/>
                        </div>
                    </div>
                </div>
            </Phone>
        );
    }

    private chatSnapshot() {

        const oriStyle = Object.assign({}, this.chatBody.style);

        this.chatBody.style.overflow = "visible";
        this.chatBody.style.position = "fixed";
        this.chatBody.style.top = "0";
        this.chatBody.style.left = "0";
        this.chatBody.style.zIndex = "999";
        this.chatBody.style.width = "267px";

        html2canvas(this.chatBody, {
            scale: 2,
            height: this.chatBody.scrollHeight,
            allowTaint: true,
        }).then((canvas) => {
            const now = new Date();
            const dlLink = document.createElement('a');
            dlLink.download = now.getFullYear() + "" + now.getMonth() + now.getDate() + now.getHours() + now.getMinutes() + now.getSeconds() + ".png";
            dlLink.href = canvas.toDataURL("image/png", 1).replace("image/png", "image/octet-stream");
            dlLink.dataset.downloadurl = ["image/png", dlLink.download, dlLink.href].join(':');
            document.body.appendChild(dlLink);
            dlLink.click();
            document.body.removeChild(dlLink);
            this.chatBody.scrollTop = this.chatBody.scrollHeight;
            this.chatBody.style = oriStyle;
        })
    }

    private deleteMessage(index: number): () => void {
        return () => {
            const copy = this.props.messages.slice(0);
            copy.splice(index, 1);
            if (this.props.newMsgRecipient) {
                this.props.newMsgRecipient(copy);
            }
        }
    }

    private sendMessage(msg: message) {
        if (this.props.newMsgRecipient) {
            const messages = this.props.messages;
            const copy = messages.slice(0);
            copy.push(msg);
            this.props.newMsgRecipient(copy)
        }
    }

    private getAdditionElement(): React.ReactElement {
        const uploadImage = (e: any) => {
            const file = e.target.files[0];
            const imgRef: string = window.URL.createObjectURL(file);
            const msg: message = {
                mine: true, avatarURL: this.props.myAvatarURL,
                isImage: true, imagePath: imgRef,
            };
            this.sendMessage(msg)
        };

        const appendTime = (e: any) => {
            const now: Date = new Date();
            const _default = [
                now.getFullYear(), now.getMonth(), now.getDate()].join("-") + " " + [
                now.getHours(), now.getMinutes(), now.getSeconds()].join(":");
            let nd: string | null = prompt("输入时间:", _default);
            if (!nd) {
                nd = _default;
            }
            const d: number = Date.parse(nd);
            if (isNaN(d)) {
                alert("时间格式" + nd + "错误: 年-月-日 时:分:秒")
            } else {
                const msg: message = {
                    isDate: true,
                    date: new Date(d),
                };
                this.sendMessage(msg);
            }
        };

        return (
            <div className={styles["addition-input"]}>
                <div className={styles.icon} title={"发送图片"}>
                    <label htmlFor={"image-input"}>
                        <img src={bottomImgUploadPicture} alt={"upload"}/>
                    </label>
                    <input id={"image-input"} type={"file"} style={{display: "none"}} accept={"image/*"}
                           onChange={uploadImage}/>
                </div>
                <div className={styles.icon} onClick={appendTime} title={"添加时间信息"}>
                    <img src={bottomTimeAppendPicture} alt={"time"}/>
                </div>
            </div>
        );
    }

    private getInputElement(): React.ReactElement {
        let newMsg: message;
        let inputWindow: any;
        const sendTextMsg = (event: any) => {
            if ((event.keyCode === 13 || event === "send") && newMsg && this.props.newMsgRecipient) {
                inputWindow.value = "";
                this.sendMessage(newMsg);
            } else {
                newMsg = {
                    mine: true,
                    avatarURL: this.props.myAvatarURL,
                    isText: true,
                    content: event.target.value,
                }
            }
        };

        return (
            <div className={styles["text-input"]} onKeyUp={sendTextMsg}>
                <span>输入: </span>
                <input
                    type={"text"}
                    placeholder={"消息..."}
                    onChange={sendTextMsg}
                    ref={(r) => inputWindow = r}/>
                <span className={styles.submit} onClick={() => sendTextMsg("send")}>发送</span>
            </div>
        );
    }

    private getVoiceInputElement(): React.ReactElement {
        let newMsg: message;
        let inputElement: any;
        const sendVoiceMsg = (event: any) => {
            if ((event.keyCode === 13 || event === "send") && newMsg && this.props.newMsgRecipient) {
                inputElement.value = "";
                this.sendMessage(newMsg)
            } else if (event.target) {
                newMsg = {
                    mine: true,
                    avatarURL: this.props.myAvatarURL,
                    isVoice: true,
                    voiceLength: event.target.value,
                }
            }
        };
        return (
            <div className={styles["voice-input"]} onKeyUp={sendVoiceMsg}>
                <span>长度: </span>
                <input ref={(e) => inputElement = e} type={"number"} placeholder={"1~60"} onChange={sendVoiceMsg}/>
                <span className={styles.submit}
                      onClick={() => sendVoiceMsg("send")}>发送</span>
            </div>
        );
    }

    private toggleBottomInputPanel(panelType?: bottomInputType): () => void {
        return () => {
            this.setState({
                showBottomInputPanel: !this.state.showBottomInputPanel,
                bottomPanelType: panelType,
            });
        }
    }
}