package com.seecen.tencent.entity;

public class Message {
    public Message(String username, String content, int type) {
        this.username = username;
        this.content = content;
        this.type = type;
    }

    public Message(String username, String content, int type, String messageId) {
        this.username = username;
        this.content = content;
        this.type = type;
        this.messageId = messageId;
    }

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }
    private String username;//谁发的



    private String content; //具体发送的内容
    //消息的类型
    //比如1 代表系统上线的消息，2 代表系统下线的消息
   //    3代表更新用户列表消息  4代表用户普通消息 5抖动 6撤回
    private int type;
    private  String messageId;//每条消息的唯一标识
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}
