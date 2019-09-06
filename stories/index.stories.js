import React from "react";

import {storiesOf} from "@storybook/react";
import {action} from '@storybook/addon-actions';

import {FixedPhone} from "../src/components/phone/fixedphone";
import {FixedChat} from "../src/components/wechat/chat/fixedChat";
import {Index} from "../src/pages";

import default_avatar1 from "../src/assets/img/default_avatar1.jpg";

storiesOf("手机", module)
    .add("空手机", () => <FixedPhone/>)
    .add("有控制器手机", () => <FixedPhone controllerPanel={<div>面板</div>}/>)
    .add("有输入手机", () => <FixedPhone controllerPanel={<div>面板</div>} controllerInput={<div>输入窗口</div>}/>)
    .add("按钮自定义", () => <FixedPhone button={{
        text: "自定义", onClick: action("button click")
    }}/>);

storiesOf("微信", module)
    .add("对话", () => {
        return <FixedChat otherUserAvatar={default_avatar1} otherUserName={"时光"} userAvatar={default_avatar1} userName={"时光"}/>
    });

storiesOf("首页", module)
    .add("page", () => <Index/>);
