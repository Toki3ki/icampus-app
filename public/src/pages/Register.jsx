import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo_p5r.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";
import BackgroundImage from '../assets/bg_mln.jpg'; // 新增背景图

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student", // ****** 新增 role 状态，默认学生 ******
  });

  // useEffect(() => {
  //   if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
  //     navigate("/");
  //   }
  // }, []);
  useEffect(() => {
    // 注册页面初始化时，如果用户已登录，根据角色跳转
    const checkUserRoleAndRedirect = async () => {
      const user = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      if (user) {
        if (user.role === 'teacher') {
          navigate("/TeacherDashboard");
        } else if (user.role === 'student') {
          navigate("/Dashboard");
        } else {
          navigate("/Dashboard"); // 默认跳转
        }
      }
    };
    checkUserRoleAndRedirect();
  }, [navigate]); // 依赖项中添加 navigate

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password, role } = values; // ****** 包含 role 字段 ******
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
        role, // ****** 发送 role 字段到后端 ******
      });
      
      console.log("注册 API 返回:", data); // 调试用

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
        // alert("data.status === false"); // ****** 移除 alert ******
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        // ****** 新增：存储 JWT Token ******
        localStorage.setItem(
          process.env.REACT_APP_TOKEN_KEY,
          data.token
        );
        // **********************************

        // alert("data.status === true"); // ****** 移除 alert ******
        toast.success("Registration successful! Please set your avatar.", toastOptions);
        navigate("/setAvatar"); // ****** 导航到 /setAvatar ******
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>ICAMPUS</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          {/* ****** 新增角色选择 ****** */}
          <div className="role-select">
            <label htmlFor="role">选择身份 / Select Role:</label>
            <select name="role" id="role" onChange={(e) => handleChange(e)} value={values.role}>
              <option value="student">学生 / Student</option>
              <option value="teacher">教师 / Teacher</option>
              {/* 通常管理员不会在这里注册，由内部创建 */}
            </select>
          </div>
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}
// 新增 OuterContainer 样式，包裹整个页面
const OutContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  // background-color:rgb(245, 245, 245); /* 可选：添加背景色以区分 */
  background-image: url(${BackgroundImage}); /* 设置背景图 */
  background-size: cover; /* 铺满容器 */
  background-position: center; /* 居中 */
  background-repeat: no-repeat; /* 不重复 */
  padding: 2rem;
  box-sizing: border-box;

  /* 限制最大宽度，防止页面过度拉伸 */
  max-width: 1440px; /* 可根据需要调整，例如 1280px 或 1600px */
  margin: 0 auto; /* 水平居中 */
`;


const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  // background-color:rgba(222, 210, 224, 0.34);
  background-image: url(${BackgroundImage}); /* 设置背景图 */
  background-size: cover; /* 铺满容器 */
  background-position: center; /* 居中 */
  background-repeat: no-repeat; /* 不重复 */
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
    .role-select { /* ****** 新增 role-select 样式 ****** */
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    label {
      color: white;
      font-size: 0.9rem;
    }
    select {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color: white;
      width: 100%;
      font-size: 1rem;
      appearance: none; /* 移除默认下拉箭头 */
      -webkit-appearance: none;
      -moz-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.7em top 50%, 0 0;
      background-size: 0.65em auto, 100%;

      option {
        background-color: #131324; /* 下拉选项的背景色 */
        color: white;
      }

      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }
  }

  button {
    background-color:rgb(94, 156, 116);
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color:rgb(145, 99, 155);
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color:rgb(94, 156, 116);
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
