/* =========================================================
   CZ AI STUDIO
   DeepSeek Frontend Edition
   用户模式
========================================================= */


/* =========================================================
   👑 管理员配置区
========================================================= */

const AI_CONFIG = {

    apiKey:
        "sk-c28411441b934531820821863a45ce94",

    model:
        "deepseek-chat",

    systemPrompt:
        `
你是 CZ Studio 的专属 AI 助手，你叫做 Zerai。

你是刘宸泽（真名），艺名[填你的艺名]。这个网站和工作室是我自己的，不是什么大厂，就是一个爱好驱动的个人项目。我自己玩 EDM，排 Festival Set，同时也是个电脑装机维修的硬核垃圾佬，聊硬件能跟你唠一天。

说话风格：

· 脏话随便飙：特么、靠、操蛋、贼几把、干就完了——怎么爽怎么来。
· 绝不端着：不讲官方套话，不假客气，像跟哥们儿在烧烤摊吹牛逼。
· 自嘲拉满：承认自己就是冤种，承认关服就是没人玩，不找借口。
· 怼人可以，但别真伤人：语气冲归冲，底子里还是认认真真回答问题。

网站现状：

1. EDM分区 & 个人SET展示：没开！没开！没开！重要的事说三遍。别问啥时候开，问就是“在搞了，急个锤子？”
2. MC服务器：2026年1月21日正式寄了。原因是人全跑光了。
3. 后续功能：会有，慢慢推。别催，催了也不会快。
4. 问题外的知识可以稍微正经点，但也可以保留个性。

底线：

· 不吹牛逼说假话，不编用户评价。
· 装机给建议，但钱用户自己掏，别让我背锅。
· 不知道的就直接说不知道，别瞎几把编。
`,

    temperature:
        0.7,

    maxTokens:
        4096

};


/* =========================================================
   DeepSeek API
========================================================= */

const API_URL =
    "https://api.deepseek.com/chat/completions";


/* =========================================================
   当前对话
========================================================= */

let messages = [];


/* =========================================================
   DOM
========================================================= */

const chat =
    document.getElementById("chat");

const input =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");

const newChat =
    document.getElementById("newChat");

const clearChat =
    document.getElementById("clearChat");


/* =========================================================
   保存主页初始 HTML
   ---------------------------------------------------------
   这样 Clear / 新建对话时，
   可以恢复你 HTML 里当前写好的主页，
   而不是重新写死三个默认按钮。
========================================================= */

const welcomeHTML =
    chat.innerHTML;


/* =========================================================
   初始化
========================================================= */

window.addEventListener(
    "load",
    () => {

        input.focus();

    }
);


/* =========================================================
   添加消息
========================================================= */

function addMessage(role, text) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        `message ${
            role === "user"
                ? "user"
                : "ai"
        }`;

    const content =
        document.createElement("div");

    content.className =
        "message-content";


    /* AI */

    if (role === "assistant") {

        content.innerHTML =
            marked.parse(text);

        highlightCode(content);

    }

    /* 用户 */

    else {

        content.textContent =
            text;

    }


    wrapper.appendChild(
        content
    );

    chat.appendChild(
        wrapper
    );

    scrollToBottom();


    return content;

}


/* =========================================================
   Markdown + 代码高亮
========================================================= */

function renderMarkdown(
    element,
    text
) {

    element.innerHTML =
        marked.parse(text);

    highlightCode(
        element
    );

}


/* =========================================================
   代码高亮
========================================================= */

function highlightCode(
    container
) {

    container
        .querySelectorAll(
            "pre code"
        )
        .forEach(
            block => {

                hljs.highlightElement(
                    block
                );

            }
        );

}


/* =========================================================
   滚动到底部
========================================================= */

function scrollToBottom() {

    chat.scrollTo({

        top:
            chat.scrollHeight,

        behavior:
            "smooth"

    });

}


/* =========================================================
   AI 打字机效果
========================================================= */

async function typeMessage(
    element,
    text
) {

    let current = "";

    const speed = 8;


    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        current +=
            text[i];

        renderMarkdown(
            element,
            current
        );

        chat.scrollTop =
            chat.scrollHeight;


        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    speed
                )
        );

    }

}


/* =========================================================
   发送消息
========================================================= */

async function sendMessage() {

    const text =
        input.value.trim();


    /* 空消息 */

    if (!text)
        return;


    /* 防止没有 Key */

    if (
        !AI_CONFIG.apiKey ||
        AI_CONFIG.apiKey.includes(
            "在这里填入"
        )
    ) {

        alert(
            "管理员还没有配置 DeepSeek API Key。"
        );

        return;

    }


    /* 清空输入 */

    input.value = "";

    input.style.height =
        "auto";


    /* 用户消息 */

    addMessage(
        "user",
        text
    );


    messages.push({

        role:
            "user",

        content:
            text

    });


    /* AI 消息 */

    const aiElement =
        addMessage(
            "assistant",
            "正在思考..."
        );


    try {

        /* =================================================
           请求 DeepSeek
        ================================================= */

        const response =
            await fetch(
                API_URL,
                {

                    method:
                        "POST",

                    headers:
                        {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${
                                    AI_CONFIG.apiKey
                                }`

                        },

                    body:
                        JSON.stringify(
                            {

                                model:
                                    AI_CONFIG.model,

                                messages:
                                    [

                                        {
                                            role:
                                                "system",

                                            content:
                                                AI_CONFIG
                                                    .systemPrompt
                                        },

                                        ...messages

                                    ],

                                temperature:
                                    AI_CONFIG
                                        .temperature,

                                max_tokens:
                                    AI_CONFIG
                                        .maxTokens,

                                stream:
                                    false

                            }
                        )

                }
            );


        /* =================================================
           HTTP 错误
        ================================================= */

        if (
            !response.ok
        ) {

            const errorText =
                await response.text();

            throw new Error(
                errorText
            );

        }


        /* =================================================
           JSON
        ================================================= */

        const data =
            await response.json();


        /* =================================================
           AI 回答
        ================================================= */

        const reply =
            data
                ?.choices?.[0]
                ?.message?.content
            ||
            "AI 没有返回内容。";


        /* =================================================
           清除“正在思考”
        ================================================= */

        aiElement.innerHTML =
            "";


        /* =================================================
           打字机
        ================================================= */

        await typeMessage(
            aiElement,
            reply
        );


        /* =================================================
           保存 AI 消息
        ================================================= */

        messages.push({

            role:
                "assistant",

            content:
                reply

        });


    }

    catch (error) {

        console.error(
            "DeepSeek API Error:",
            error
        );


        aiElement.innerHTML = `

            <div
                style="
                    color:#ff7280;
                    font-weight:600;
                "
            >
                API REQUEST FAILED
            </div>

            <div
                style="
                    margin-top:8px;
                    font-size:12px;
                    color:#7889a3;
                    white-space:pre-wrap;
                "
            >
                ${escapeHtml(
                    error.message
                )}
            </div>

        `;

    }

}


/* =========================================================
   HTML 转义
========================================================= */

function escapeHtml(
    text
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


/* =========================================================
   Enter 发送
   Shift + Enter 换行
========================================================= */

input.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


/* =========================================================
   输入框自动高度
========================================================= */

input.addEventListener(
    "input",
    () => {

        input.style.height =
            "auto";

        input.style.height =
            Math.min(
                input.scrollHeight,
                180
            ) + "px";

    }
);


/* =========================================================
   发送按钮
========================================================= */

sendBtn.addEventListener(
    "click",
    sendMessage
);


/* =========================================================
   清空聊天
   ---------------------------------------------------------
   不再使用 chat.innerHTML = ""
   因为那会把 ZERAI 主页一起删除。
========================================================= */

clearChat.addEventListener(
    "click",
    () => {

        messages = [];


        /* 删除聊天消息 */

        chat
            .querySelectorAll(
                ".message"
            )
            .forEach(
                message => {

                    message.remove();

                }
            );


        /* 如果主页被之前的代码删掉了，
           则恢复 HTML 初始主页 */

        if (
            !chat.querySelector(
                ".welcome"
            )
        ) {

            chat.innerHTML =
                welcomeHTML;

        }


        input.focus();

    }
);


/* =========================================================
   新建对话
========================================================= */

newChat.addEventListener(
    "click",
    () => {

        messages = [];


        /* 删除聊天消息 */

        chat
            .querySelectorAll(
                ".message"
            )
            .forEach(
                message => {

                    message.remove();

                }
            );


        /* 保留你 HTML 中原本的主页 */

        if (
            !chat.querySelector(
                ".welcome"
            )
        ) {

            chat.innerHTML =
                welcomeHTML;

        }


        input.value = "";

        input.style.height =
            "auto";

        input.focus();

    }
);


/* =========================================================
   快捷建议
========================================================= */

function bindSuggestions() {

    document
        .querySelectorAll(
            ".suggestions button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const text =
                            button.innerText
                                .replace(
                                    /^.\s*/,
                                    ""
                                );


                        input.value =
                            text;

                        input.focus();


                        input.style.height =
                            "auto";

                        input.style.height =
                            Math.min(
                                input.scrollHeight,
                                180
                            ) + "px";

                    }
                );

            }
        );

}


/* =========================================================
   初始化快捷按钮
========================================================= */

bindSuggestions();


/* =========================================================
   防止重复发送
========================================================= */

let isGenerating = false;


/* =========================================================
   控制台信息
========================================================= */

console.log(
    "%c CZ AI STUDIO ",
    `
        background:#0b4fff;
        color:white;
        padding:6px 12px;
        border-radius:5px;
        font-weight:bold;
    `
);

console.log(
    "AI Model:",
    AI_CONFIG.model
);