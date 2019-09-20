import * as moment from "moment";
import * as React from "react";
import {Modal, TimePicker} from "antd";

import styles from "../../assets/css/iphone.module.css";
import {ArrayLoops} from "../../utils";

const buttonTexts: ArrayLoops = new ArrayLoops(["扶贫", "加餐", "打赏", "点赞"]);

interface IPhoneStats {
    signalCount: ArrayLoops;
    operator: ArrayLoops;
    signalType: ArrayLoops;
    timer: Date;
    electricity: number;
    batteryStatus: ArrayLoops,

    timerSetVisible: boolean;
}

export class IPhone extends React.Component<{}, IPhoneStats> {
    private readonly buttonText: string;
    private timer: any;

    constructor(props: any) {
        super(props);
        this.nowTimeString = this.nowTimeString.bind(this);
        this.modifyElectricity = this.modifyElectricity.bind(this);

        this.buttonText = buttonTexts.random();
        this.timer = setInterval(() => {
            this.setState({timer: new Date()})
        }, 30000);

        this.state = {
            signalCount: new ArrayLoops([1, 2, 3, 4], 2),
            operator: new ArrayLoops(["中国移动", "中国联通", "中国电信"]),
            signalType: new ArrayLoops(["wifi", "3G", "4G", "5G", "6G"]),
            timer: new Date(),
            electricity: 64,
            batteryStatus: new ArrayLoops(["normal", "charge", "saving"]),
            timerSetVisible: false,
        };
    }

    public render(): React.ReactElement {

        const electricity: number = this.state.electricity;
        let batteryValueStyles: any = {width: electricity / 100 * 80 + "%"};
        switch (this.state.batteryStatus.currentValue()) {
            case ("normal"):
                if (electricity <= 20) {
                    batteryValueStyles["backgroundColor"] = "red";
                    break;
                }
                batteryValueStyles["backgroundColor"] = "black";
                break;
            case ("charge"):
                batteryValueStyles["backgroundColor"] = "#56EB2C";
                break;
            default:
                batteryValueStyles["backgroundColor"] = "#FFCC0C";
        }

        return (
            <div className={styles.iphone}>
                <div className={styles.screen}>
                    <div className={styles.header}>
                        <div datatype={"clickable"} className={styles.signal}
                             onClick={() => {
                                 this.setState({signalCount: this.state.signalCount.next()})
                             }}>
                            {Array.from({length: 4}).map((_, index) => {
                                return <div className={styles.bar} style={{height: (index + 1) / 4 * 50 + 20 + "%", visibility: (index + 1) > this.state.signalCount.currentValue() ? "hidden" : "visible"}}/>;
                            })}
                        </div>
                        <div className={styles.operator} datatype={"clickable"} onClick={() => {
                            this.setState({operator: this.state.operator.next()})
                        }}>
                            <p>{this.state.operator.currentValue()}</p>
                        </div>
                        <div className={styles.type} datatype={"clickable"} onClick={() => {
                            this.setState({signalType: this.state.signalType.next()})
                        }}>
                            <p style={{display: this.state.signalType.currentValue() !== "wifi" ? "inline-block" : "none"}}>{this.state.signalType.currentValue()}</p>
                            <div style={{display: this.state.signalType.currentValue() === "wifi" ? "inline-block" : "none"}} className={styles.wifi}/>
                        </div>
                        <div className={styles.timer} datatype={"clickable"} onClick={() => this.setState({timerSetVisible: true})}>
                            <p>{this.nowTimeString()}</p>
                        </div>
                        <Modal
                            title={"设置时间"}
                            visible={this.state.timerSetVisible}
                            okText={"设置"}
                            cancelText={"复位"}
                            onCancel={() => {
                                this.timer = setInterval(() => {
                                    this.setState({timer: new Date()})
                                }, 30000);
                                this.setState({
                                    timer: new Date(),
                                    timerSetVisible: false,
                                })
                            }}
                            onOk={() => {
                                clearInterval(this.timer);
                                this.setState({timerSetVisible: false})
                            }}
                        >
                            <TimePicker
                                onChange={(time: moment.Moment, timeString: string) => {
                                    const tm: Date = new Date(this.state.timer.valueOf());
                                    tm.setHours(time.hours(), time.minutes());
                                    this.setState({timer: tm});
                                }}
                            />
                        </Modal>
                        <div style={{width: this.state.batteryStatus.currentValue() === "charge" ? "22%" : "25%"}} className={styles.electricity} datatype={"clickable"} onClick={this.modifyElectricity(true)} onContextMenu={this.modifyElectricity()}>
                            <p>{electricity}%</p>
                        </div>
                        <div className={styles.battery} datatype={"clickable"} onClick={() => this.setState({batteryStatus: this.state.batteryStatus.next()})}>
                            <div className={styles.value} style={batteryValueStyles}/>
                        </div>
                        <div className={styles.lightning} style={{display: this.state.batteryStatus.currentValue() === "charge" ? "inline-flex" : "none"}}/>
                    </div>
                </div>
                <div className={styles.button} datatype={"clickable"}>
                    {this.buttonText}
                </div>
            </div>
        );
    }

    private nowTimeString(): string {
        const hours: number = this.state.timer.getHours();
        const minutes: number = this.state.timer.getMinutes();
        return (hours < 10 ? "0" + hours : hours + "") + ":" + (minutes < 10 ? "0" + minutes : minutes + "")
    }

    private modifyElectricity(add?: boolean): (e: any) => void {
        const that = this;
        return (e: any) => {
            e.preventDefault();
            let newElectricity: number;
            const value: number = Math.floor(Math.random() * 10);
            if (add) {
                newElectricity = that.state.electricity + value;
            } else {
                newElectricity = that.state.electricity - value;
            }
            if (newElectricity >= 100) {
                newElectricity = 100;
            } else if (newElectricity <= 0) {
                newElectricity = 0;
            }
            that.setState({electricity: newElectricity})
        }
    }
}
