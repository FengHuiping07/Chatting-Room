var vipMenu= $("#vipMenu");

$("#vip").hover(function(){
    // var x = $(this).offset().left-vipMenu.width() + $("#vip").width();
    // var y = $(this).offset().top +$("#vip").height() -20;
    vipMenu.show();
},function(){
    isHide();
});
vipMenu.hover(function(){
    $(this).show();
},function(){
    isHide();
});

function isHide() {
    if(!$("#vipTxt").is(":focus")){
        $("#vipMenu").hide();
    }
}

$("html").click(function(e){
    //找到有没有一个叫#VIPMenu的祖先
    var tag =$(e.target).parents("#vipMenu");
    //把这个祖先的ID 取出来
    if(tag[0]&& tag[0].id == "vipMenu") return;
    $("#vipMenu").hide();
})
 $("#read").click(function(){
     //自动判断是否有这个class 有久删除，没有就添加
     $(this).toggleClass("uncheck");
     $(this).toggleClass("checked");
 });
$(window).resize(function(){
    if($(document).width()<1024){
        $("#left").addClass("small");
    }
    else{
        $("#left").removeClass("small");
    }
    if($(document).width()<900){
        $("#left").hide();
    }
    else{
        $("#left").show();
    }

});


$("#faceImg").click(function(){
    // console.log("99");
    $("#face").click();
});
$("#face").change(function(){
    var thisFile = this.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(thisFile);/* 异步解析，不会立马返回结果*/
    reader.onload = function (e){
        var data = e.target.result;
        $("#faceImg").addClass("faceImg");
        $("#faceImg").attr("src",data);
    }

})
//错误提示
$("#passBox").focus(function(){
    $("#ulrequire").css({"opacity":1,"position":"relative"});
});
$("#passBox").blur(function(){
    $("#ulrequire").css({"opacity":0,"position":"absolute"});
})
isFocus($(".name"),$("#namerequire"));
isFocus($("#passBox"),$("#pwrequire"));
function isFocus(arr,vule) {
    arr.focus(function(){
        arr.css({"border": "0.5px solid blue"  });
        vule.css({"opacity":0,"position":"absolute"});
    });
    arr.blur(function () {
        if (arr.val() == "") {
            arr.css({ "outline": "none", "border": "0.5px red solid" });
            vule.css({"opacity":1,"position":"relative"});
        }
    })
}