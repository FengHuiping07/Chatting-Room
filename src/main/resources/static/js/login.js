$("#desktop li").click(function () {
    //清除之前
    $("#desktop li").removeClass("choose");
    //给当前点击的li 添加样式
    $(this).addClass("choose");
})
 $("html").click(function (e) {
    if(e.target.tagName == "HTML"){
        $("#desktop li").removeClass("choose");
    }
 });
$("#box>span").click(function(){
    $(this).toggleClass("checked");
});

var win = document.getElementById("tencent");
var x,y;
win.ondragstart = function(e){
    x = e.offsetX;
    y = e.offsetY;
}

win.ondrag = function(e){
    if($("#username").is(":focus")) return;
    if(e.pageX == 0 && e.pageY == 0) return;
    win.style.left = e.pageX - x + "px";
    win.style.top = e.pageY - y + "px";
}
$("#username").on("input propertychange",function () {
    var url = "/face?username=" + this.value;
    $("#face").attr("src",url);

});
$("#face").on("error",function () {
    $(this).attr("src","/images/default_face.png");
})
$("#small").click(function () {
    $("#tencent").addClass("small");
    $("#qq_task").show();

})
//点击id为qq的桌面图标 显示tencent主界面
$("#qq").dblclick(function(){
    $("#tencent").fadeIn(300);
})
//点击任务栏的小图标QQ 显示tencent 界面
$("#qq_task").click(function(){
    $("#tencent").removeClass("small");
    $(this).hide();//隐藏自己的小图标
});
//如果有dialog 显示框 则tencent 默认显示
var dialog = document.getElementById("dialog");
if(dialog){
    var url = "/face?username=" + $("#username").val();
        $("#faceImg").attr("src",url);
        $("#tencent").show();

}



