import * as React from "react";
import {EmojiText} from "../../../../utils";

import {RedPackageReceivedMessage} from "./types";
import {MessageWrap} from "./wrap";

import styles from "../../../../assets/css/wechat-chat-message.module.css";

export class RedPackageReceived extends React.Component <{
    msg: RedPackageReceivedMessage,
    OnDelete?: () => void;
}, {}> {
    public render(): React.ReactElement {
        let content: string = this.props.msg.sender + "领取了你的";
        if (this.props.msg.mine) {
            content = "你领取了" + this.props.msg.friend + "的";
        }

        return (
            <MessageWrap OnDelete={this.props.OnDelete}>
                <div datatype={"system"} style={{display: "flex", justifyContent: "center"}}>
                    <p className={styles["package-received"]}>
                        <span datatype={"icon"}/>
                        <span><EmojiText content={content}/><span style={{color: "rgba(255,36,0, 0.9)"}}>红包</span></span>
                    </p>
                </div>
            </MessageWrap>
        );
    }
}
