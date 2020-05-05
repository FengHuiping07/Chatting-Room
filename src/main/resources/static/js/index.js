var username = $ ("#username").val();
//window.location.host代表获取ip：port
var url = "ws://" + window.location.host + "/chat?username=" + username;
//与后台建立webSocket 长连接
var ws = new WebSocket(url);

ws.onopen = function () {
    // alert("连接成功");
}
//当后台发送数据给前台，会执行的函数
ws.onmessage = function(e){
    var message = JSON.parse(e.data);
    // alert(message.username);
    // alert(message.type);
    // alert(message.content);

    //当没有type的时候 意味着传进用户列表
    if(!message.type){
        onlineUser(message);
        onlineFace();


    }else if(message.type == 1){
        systemOnlineMessage(message);


    }else if(message.type == 4){
        userTextMessage(message);

    }else if(message.type == 5){
        dydMessage(message);
    }else if(message.type == 6){
        backupMessage(message);
    }
    $("#record").scrollTop(9999999);
}
console.log(username);

function  systemOnlineMessage(message) {
    var str = new Array();
    str.push("<div class='system_online'>")
    str.push("-----");
    str.push(message.username + ":" + message.content);
    str.push("-----");
    str.push("</div>");
    $("#record").append(str.join(""));

}

//上线在左上方出现头像
function onlineFace(){
    $("#left_tool").empty();
    var username = $("#username").val();
    var str1 = new Array();
    str1.push("<li>");
    str1.push("<span >");
    str1.push("<img id='topface' src='/face?username="+username+"'>");
    str1.push("</span>");
    str1.push("<span id='topname'>");
    str1.push(username);
    str1.push("</span>");
    str1.push("</li>");
    $("#left_tool").append(str1.join(""));

}

function onlineUser(usernames){
    //每次新上线，清空列表
    $("#online_people").empty();
    var str = new Array();
    for (var i=0; i< usernames.length;i++){
        str.push("<li>");
        str.push("<span>");
        str.push("<img src='/face?username=" + usernames[i]+"'>");
        str.push("</span>");
        str.push("<span>");
        str.push(usernames[i])
        str.push("</span>");
        str.push("</li>");

    }
     $("#online_people").append(str.join(""));


}
function  userTextMessage(message) {
    if (message.username == username) {
        var str = new Array();
        str.push("<div >");
        str.push("<img src='/face?username=" + message.username + "' class='chatFace chatFace_me'>");
        str.push("<div class='fr'>");
        str.push("<span class='fr'>" + message.username + "</span>");
        str.push("<span messageId='" + message.messageId + "'class='text fr clear'>" + message.content + "</span>");
        str.push("</div>");
        str.push("<div style='clear:both;'></div>");
        str.push("</div>");
        $("#record").append(str.join(""));
    } else {
        var str = new Array();
        str.push("<div >");
        str.push("<img src='/face?username=" + message.username + "' class='chatFace'>");
        str.push("<div class='float_left'>");
        str.push("<span>" + message.username + "</span>");
        str.push("<span messageId='" + message.messageId + "'class='text'>" + message.content + "</span>");
        str.push("</div>");
        str.push("<div style='clear:both;'></div>");
        str.push("</div>");
        $("#record").append(str.join(""));
    }
}
function  dydMessage(message){
    var str = new Array();
    str.push("<div class='dyd'>")
    str.push(message.username + ":" + message.content);
    str.push("</div>");
    $("#record").append(str.join(""));
    //执行动画，让窗口抖起来
    //获取窗口本来的位置
    var left = $("#win").offset().left;
    var top = $("#win").offset().top;
    for (var i = 0;i < 10; i++){
        //随机一个1到10 的整数
        var leftNumber = parseInt(Math.random()*10)+1;
        var topNumber = parseInt(Math.random()*10)+1;
        var flag = parseInt(Math.random()*10)+1;
        if(flag % 2 ==0){
            $("#win").animate({"left":left + leftNumber + "px"},10);
            $("#win").animate({"top":top + topNumber + "px"},10);
        }else{
            $("#win").animate({"left":left - leftNumber + "px"},10);
            $("#win").animate({"top":top - topNumber + "px"},10);
        }
    }
    $("#win").animate({"left":left  + "px"},10);
    $("#win").animate({"top":top + "px"},10);
}
function  backupMessage(message){
    var thisMessage = $("#record .text").filter("[messageId='"+message.messageId+"']");
    thisMessage.parent().parent().replaceWith("<div class='backup'> "+message.content+"</div>");

}

//发送消息可编辑div

//回车发消息
$("#textInput").keydown(function(e){
    var keycode = window.event ? e.keyCode : e.which;
    var evt = e || window.event;
    var inputTxt = $(this);
    // 回车-->发送消息
    if (keycode == 13 && !(evt.ctrlKey)) {
        // 发送消息的代码
        var value = $("#textInput").html();
        ws.send(value);
        $("#textInput").empty();
        $("#textInput").focus();
        e.preventDefault();
        return false;
    }
    // ctrl+回车-->换行
    if (evt.ctrlKey && evt.keyCode == 13) {
        inputTxt.html(inputTxt.html() + "<br>");
        woohecc.placeCaretAtEnd(inputTxt.get(0));
        return false;
    }
});
var woohecc = {
    placeCaretAtEnd : function(el) {
        el.focus();
        if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
        else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    },
}
$("#sendBtn").click(function(){
        var value = $("#textInput").html();
        ws.send(value);
        $("#textInput").empty();
        $("#textInput").focus();
    })

/*表情包*/
$("#textInput").emoji({
    button:"#emojiBtn",
    showTab: true,
    animation: "fade",
    icons: [{
        name: "QQ表情",
        path: "/emoji/dist/img/qq/",
        maxNum: 92,
        file: ".gif"
    },{
        name: "贴吧表情",
        path: "/emoji/dist/img/tieba/",
        maxNum: 50,
        file: ".jpg"
    }]
});
//抖一抖功能
// $("#dyd").click(function () {
//     var val =$("#dydValue").val();
//     if(val){
//         ws.send("\0");
//         $("#dydValue").val("");//清空没有1 这个数据
//         setTimeout(function () {
//             $("#dydValue").val("1");
//         },10000);
//     }else{
//         $("#warning").show();
//         $("#warning").fadeOut(2000);//淡入淡出
//     }
//
// })
var flag = true;
$("#dyd").click(function(){
    if(flag){
        flag = false;
        ws.send("\0");
        setTimeout(function () {
            flag = true;
        },10000);
    }else{
        $("#warning").show();
        $("#warning").fadeOut(2000);
    }
})






$("#imgBtn").click(function () {
    $("#file").click();
});
$("#file").change(function () {
    var files = this.files;//取到用户选择的所有的文件
    for(var i = 0;i < files.length;i++){//遍历这些文件
        var reader = new FileReader();
        reader.readAsDataURL(files[i]);//读取当前这一张图片
        reader.onload = function (e){//读完会走这个函数
            var img = document.createElement("img");
            img.src = e.target.result;
            img.className = "imgData";
            $("#textInput").append(img);
        }
    }
})
//取消默认的右键事件
// var document = document.getElementById("win");
document.oncontextmenu = function (){
    return false;
}

$("#record").on("mousedown",".text",function (e) {
    //获取登陆者的用户名
    var username = $("#username").val();
    var messageUsername = $(this).prev().html();
    if(e.which == 3 && username ==  messageUsername){
        var messageId = $(this).attr("messageId");
        $("#messageId").val(messageId);
        $("#backup").css({"left":e.pageX,"top":e.pageY}).show();
    }
})
$("#backup").click(function () {
     var messageId = $("#messageId").val();
     //以暗号+id 发送给后台，后台收到 所有客户端页面删除这条信息
     ws.send("\1"+ messageId);
     $(this).hide();
})
$(document).click(function(e){
    if(e.target.id != "backup"){
        $("#backup").hide();
    }
})