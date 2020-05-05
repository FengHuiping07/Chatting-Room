package com.seecen.tencent.web;

import com.seecen.tencent.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

@Controller
public class UserController {
    @Autowired
    //数据库 保存值
    private RedisTemplate<String, Object> redisTemplate;

    @RequestMapping("/doRegister")
    public ModelAndView doRegister(User user, MultipartFile face) throws Exception {
        ModelAndView mv;
        if (redisTemplate.hasKey(user.getUsername())) {
            mv = new ModelAndView("register");
            mv.addObject("msg", "要注册的账户已存在，请更换");
            return mv;
        }
        //先把头像放进去
        user.setFaceByte(face.getBytes());
        redisTemplate.opsForValue().set(user.getUsername(), user);
        mv = new ModelAndView("redirect:/login.html");
        return mv;

    }

    @RequestMapping("/face")
    @ResponseBody//不跳转页面 直接返回数据
    public byte[] queryFace(String username) {
        if (redisTemplate.hasKey(username)) {
            User user = (User) redisTemplate.opsForValue().get(username);
            return user.getFaceByte();
        }
        return null;
    }

    @RequestMapping("/doLogin")
    public ModelAndView doLogin(User user, HttpSession session) {
        ModelAndView mv = new ModelAndView();
        if (redisTemplate.hasKey(user.getUsername())) {
            //取出数据库中的这个user
            User redisUser = (User) redisTemplate.opsForValue().get(user.getUsername());
            //拿数据库中的user和传进来的user密码做比较
            if (redisUser.getPassword().equals(user.getPassword())) {
                mv.setViewName("redirect:/index.html");
                //把用户的登录信息保存到会话中，用户不关闭浏览器，在任何页面都可以获取
                session.setAttribute("user", redisUser);
                return mv;
            }
        }
        mv.setViewName("login");
        //保存所写的头像和用户名 不消失
        mv.addObject("username",user.getUsername());
        mv.addObject("msg", "用户或密码错误");
        return mv;
    }

}
