<template>
    <div class="home-container">
        <div class="main_block">
            <div class="d-1">
                <img
                    src="@/assets/logo.png"
                    width="110"
                    height="58"
                    alt
                    ondragstart="return false;"
                    oncontextmenu="return false;"
                    style="width: auto; height: 50px; margin: 25px 10px 0 25px; float: left; z-index: 2;"
                />
                <div class="link-block">
                    <a
                        class="a_link"
                        onselectstart="return false;"
                    >Team</a>
                    <a
                        class="a_link"
                        onselectstart="return false;"
                    >Colorful</a>
                    <a
                        class="a_link"
                        onselectstart="return false;"
                    >S Blog</a>
                </div>
                <transition :name="show.mobileNav ? 'move-top-to-bottom' : 'scale-down-to-down'">
                    <div
                        v-show="show.mobileNav"
                        class="s-link-block"
                    >
                        <a
                            class="s-link"
                            onselectstart="return false;"
                        >Team</a>
                        <a
                            class="s-link"
                            onselectstart="return false;"
                        >Colorful</a>
                        <a
                            class="s-link"
                            onselectstart="return false;"
                        >S Blog</a>
                        <button
                            class="s-link"
                            style="background: transparent; border: rgba(242,242,242,0.8) solid 1px; border-radius: 15px;"
                            @click="show.mobileNav ^= true"
                        >关闭</button>
                    </div>
                </transition>
                <span
                    class="nav-icon ms-Icon ms-Icon--GlobalNavButton"
                    @click="show.mobileNav ^= true"
                ></span>
            </div>
        </div>
        <fv-flip-view
            v-model="sliderList"
            theme="dark"
            style="width: 100%; min-height: 100%; height: 100%;"
        >
            <template v-slot:item="x">
                <div class="flip-box">
                    <fv-img
                        :src="x.data.src"
                        style="width: 100%; height: 100%;"
                    ></fv-img>
                    <span
                        class="container-text"
                        v-html="x.data.content"
                        style="font-size: 32px;"
                        :style="{color: x.data.color}"
                    ></span>
                </div>
            </template>
        </fv-flip-view>
        <div style="position: relative; width: 80%; height: auto; margin-left: 10%; text-align: center; float: left; overflow: hidden;">
            <div style="width: 100%; float: left;">
                <fv-img
                    :src="require('@/assets/S Information.png')"
                    :onlazy="true"
                    style="width: 320px; height: auto; float: left;"
                />
            </div>
            <img
                :src="require('@/assets/ad.png')"
                :onlazy="true"
                style="width: 100%; max-width: 600px; height: auto;"
            />
            <div style="position: relative; width: 100%; margin-top: 35px; margin-bottom: 35px; display: flex; justify-content: center;">
                <div style="width: 500px; display: flex; justify-content: space-around; align-items: center;">
                    <fv-button
                        theme="dark"
                        borderRadius="8"
                        background="black"
                        style="width: 150px; height: 45px; margin-top: 15px;"
                    >了解更多</fv-button>
                    <fv-button
                        theme="dark"
                        borderRadius="8"
                        background="black"
                        style="width: 150px; height: 45px; margin-top: 15px;"
                    >加入我们</fv-button>
                </div>
            </div>
        </div>
        <div
            class="bot-line"
            style="margin-top: 5px;"
        >
            <div style="position: relative; width: 10%; height: auto; margin-left: 5%; float: left;">
                <span style="margin-top: 10px; layer-background-color: #FFFFFF; border: 1px none #000000; font-family: Century Gothic; font-size: 16px; color: rgba(255,255,255,0.75); float: left;">Contact</span>
                <div style="width: 50px; height: auto; margin-left: 30%; float: left;">
                    <a href="http://m.weibo.cn/u/5640347073">
                        <img
                            src="@/assets/contact/weibo.png"
                            width="500"
                            height="160"
                            alt
                            class="contact_icon"
                        />
                    </a>
                    <a href="Share.html">
                        <img
                            src="@/assets/contact/wechat.png"
                            width="500"
                            height="379"
                            alt
                            class="contact_icon"
                        />
                    </a>
                    <a href="Share.html">
                        <img
                            src="@/assets/contact/qq.png"
                            width="500"
                            height="500"
                            alt
                            class="contact_icon"
                        />
                    </a>
                </div>
            </div>
            <div style="position: relative; width: 100%; height: 30px; float: left;">
                <span style="color: rgba(255,255,255,0.5); font-family: '微软雅黑'; font-size: 12px; font-weight: 100; float: right;">闽ICP备17000947号 | Creator SN®</span>
            </div>
        </div>
        <div
            class="ret-top-div"
            onclick="Retop()"
        >
            <span
                class="ms-Icon ms-Icon--ChevronUp"
                style="color: rgba(242,242,242,1);"
            ></span>
        </div>
    </div>
</template>

<style lang="scss">
.home-container {
    @include app;

    width: 100%;
    height: 100%;
    overflow: auto;

    .main_block {
        position: fixed;
        width: 100%;
        height: auto;
        background-size: cover;
        z-index: 2;

        .d-1 {
            position: relative;
            width: 100%;
            height: 100px;
            background: linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
            z-index: 2;
        }

        .link-block {
            margin-top: 10px;
            float: right;
        }

        .s-link-block {
            @include VcenterC;

            position: fixed;
            width: 100%;
            height: 100%;
            padding: 15px;
        }

        .nav-icon {
            width: auto;
            height: 50px;
            margin: 35px 10px 0 25px;
            color: rgba(242, 242, 242, 1);
            font-size: 28px;
            visibility: hidden;
            float: right;
            z-index: 2;
        }
    }

    .flip-box {
        position: relative;
        width: 100%;
        height: 100%;

        .container-text {
            position: absolute;
            width: 70%;
            height: 50px;
            left: 15%;
            top: 40%;
            font-family: "微软雅黑";
            font-size: 24px;
            font-weight: 100;
            color: rgba(36, 36, 36, 0.7);
            text-shadow: 1px 1px 10px rgba(242, 242, 242, 0.6);
            text-align: center;
        }
    }

    .ret-top-div {
        position: fixed;
        bottom: 45px;
        right: 0;
        width: 35px;
        height: 35px;
        background: rgba(0, 0, 0, 0.8);
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        -webkit-animation: rtd-off 0.5s both;
    }

    .a_link {
        margin-right: 30px;
        font-size: 30px;
        font-family: "微软雅黑";
        color: rgba(255, 255, 255, 1);
        text-decoration: none;
        cursor: pointer;
        -webkit-animation: a_link_normal 0.2s both;
        &:hover {
            -webkit-animation: a_link_lighter 0.2s both;
        }
        &:active {
            -webkit-animation: a_link_down 0.1s both;
        }
    }
    .login {
        font-size: 18px;
        font-family: "微软雅黑";
        font-weight: 100;
        text-align: center;
        color: rgba(255, 255, 255, 1);
        border: rgba(255, 255, 255, 1) solid 1px;
        border-radius: 5px;
        cursor: pointer;
    }
    .bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 0;
    }
    .bg_on {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        -webkit-animation: go_on 1s both;
    }
    .bg_dis {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        -webkit-animation: go_dis 1s both;
    }
    .Ad1 {
        font-family: "微软雅黑";
        color: hotpink;
        font-size: 30px;
        text-align: center;
        width: 100%;
        height: auto;
        margin-top: 2%;
        float: left;
    }
    .re_on {
        -webkit-animation: go_on 0.2s both;
    }
    .re_dis {
        -webkit-animation: go_dis 0.2s both;
    }
    .bot-line {
        position: relative;
        float: left;
        width: 100%;
        height: auto;
        background: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9));

        .contact_icon {
            width: 100%;
            margin-top: 10%;
            margin-left: 30%;
            height: auto;
            opacity: 0.7;
            float: left;
            &:hover {
                opacity: 1;
                float: left;
            }
            &:active {
                opacity: 0.9;
                float: left;
            }
        }
    }

    @-webkit-keyframes a_link_normal {
        from {
            color: rgba(50, 191, 242, 1);
        }
        to {
            color: rgba(255, 255, 255, 1);
        }
    }
    @-webkit-keyframes a_link_lighter {
        from {
            color: rgba(255, 255, 255, 1);
        }
        to {
            color: rgba(50, 191, 242, 1);
        }
    }
    @-webkit-keyframes a_link_down {
        from {
            color: rgba(50, 191, 242, 1);
        }
        to {
            color: rgba(61, 127, 205, 1);
        }
    }
    @-webkit-keyframes go_on {
        from {
            opacity: 0;
            -webkit-filter: blur(10px);
        }
        to {
            opacity: 1;
            -webkit-filter: blur(0px);
        }
    }
    @-webkit-keyframes go_dis {
        from {
            opacity: 1;
            -webkit-filter: blur(0px);
        }
        to {
            opacity: 0;
            -webkit-filter: blur(10px);
        }
    }
    @keyframes blur-off {
        from {
            filter: blur(10px);
        }
        to {
            filter: blur(0px);
        }
    }
}

@media screen and (max-width: 1024px) {
    .home-container {
        .main_block {
            .link-block {
                display: none;
            }
            .s-link-block {
                position: fixed;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                text-align: center;
                z-index: -1;
                display: flex;
                -webkit-backdrop-filter: blur(8px);
            }
            .nav-icon {
                visibility: visible;
            }
        }
    }
    .s-link {
        width: 100%;
        height: auto;
        margin-top: 5px;
        margin-bottom: 15px;
        font-family: "微软雅黑";
        font-size: 24px;
        color: rgba(242, 242, 242, 1);
        text-decoration: none;
        float: left;
        cursor: pointer;
    }
    .container-text {
        position: relative;
        width: 100%;
        height: 100px;
        left: 0;
        top: 0;
        font-family: "微软雅黑";
        font-size: 24px;
        font-weight: 100;
        color: rgba(36, 36, 36, 0.7);
        text-shadow: 1px 1px 10px rgba(36, 36, 36, 0.3);
        text-align: center;
        float: left;
    }
}
</style>

<script>
export default {
    data() {
        return {
            sliderList: [
                {
                    src: require("@/assets/p0.png"),
                    content: `If You Are Also Interesting in Developping
				<br />Whatever you like
				<br />C,C++ C# Java JavaScript Python...
				<br />Come and Contact Me.`,
                    color: "rgba(255, 255, 255, 0.8)"
                },
                {
                    src: require("@/assets/p1.png"),
                    content: `We Also Like To Share Some Ideas About Photograph.`,
                    color: "rgba(255, 255, 255, 0.8)"
                },
                {
                    src: require("@/assets/p2.png"),
                    content: `Let’s Create Some Fabulous Stuff.`,
                    color: "rgba(255, 255, 255, 0.8)"
                },
            ],
            show: {
                mobileNav: false,
            },
        };
    },
};
</script>