package com.seecen.tencent.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seecen.tencent.entity.Message;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

public class IndexController extends AbstractWebSocketHandler {
    //保存所有在线用户seesion 的集合容器
    private static CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    //保存所有在线用户名
    private  static CopyOnWriteArrayList<String> usernames = new CopyOnWriteArrayList<>();
    //
    ObjectMapper om = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//        super.afterConnectionEstablished(session);
        String username = (String)session.getAttributes().get("username");
        //保存连接的这个人的seesion和用户名
        usernames.add(username);
        sessions.add(session);
        //发送一个谁谁上线的消息
         Message message= new Message("系统消息",username + "上线了",1);
         String jsonStr = om.writeValueAsString(message);
         //转换好数据，发给所有人
         sendAll(jsonStr);
         //发送给所有在线用户表
        jsonStr = om.writeValueAsString(usernames);
        sendAll(jsonStr);
    }
    //给所有人发消息
    public void sendAll(String jsonStr) throws IOException{
        //给每个人发jsonStr 消息
        for(WebSocketSession session:sessions){
            //防止发送过程中，用户退出，所以seesion是正常打开的状态下才发
            if(session.isOpen()){
                session.sendMessage(new TextMessage(jsonStr));
            }
        }
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        String username = (String)session.getAttributes().get("username");
        Message msg=null;
        String  msgStr = message.getPayload().toString();
        //如果是\0则 发送抖动
        if("\0".equals(msgStr)){
          msg = new Message("系统消息",username + "发送了一个窗口抖动",5);

        }else if(msgStr.startsWith("\1")){
            String messageId = msgStr.substring(1);//截取\1后面的字符
            msg = new Message("系统消息",username + "撤回了一条消息",6,messageId);
        }else {
          msg = new Message(username,message.getPayload().toString(),4, UUID.randomUUID().toString());
        }

        String jsonStr = om.writeValueAsString(msg);
        sendAll(jsonStr);

    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        super.handleTransportError(session, exception);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String username = (String)session.getAttributes().get("username");
        //移除这个session
        sessions.remove(session);
        usernames.remove(username);
        //发送一个谁谁上线的消息
        Message message= new Message("系统消息",username + "下线了",1);
        String jsonStr = om.writeValueAsString(message);
        //转换好数据，发给所有人
        sendAll(jsonStr);
        //发送给所有在线用户表
        jsonStr = om.writeValueAsString(usernames);
        sendAll(jsonStr);
    }
}
