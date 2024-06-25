import React, { useEffect, useRef, useState } from 'react'
import s from './Login_Page.module.css'
import { useNavigate } from 'react-router-dom'
import { Button, Checkbox, Form, Input } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
const Login_Page = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState()
  const [pass, setPass] = useState()
  const formRef = useRef(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(formRef.current)
    try {
      const response = await fetch('http://192.168.1.109:8000/login', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Сетевой запрос не удался')
      }
      if (response.ok) {
        const result = await response.json()
        // console.log('Успех:', result.access_token)
        // console.log(result)
        localStorage.setItem('access', result.access_token)
        localStorage.setItem('user', user)
        // console.log(localStorage)
        navigate('/main')
      }
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }
  return (
    <div>
      <header className={s.mainHead}>
        <div className={s.mHead1}></div>
      </header>
      <div className={s.cont}>
        <div className={s.contCentr}>
          <div className={s.contCenChl}>
            <div className={s.leftCont}>
              <span className="fontSt_seven">Введите логин и пароль</span>
              <form ref={formRef} onSubmit={handleSubmit} className={s.formSub}>
                <span className="fontSt_One24grey">Логин:</span>
                <Input
                  type="text"
                  name="username"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  required
                  prefix={<UserOutlined />}
                  placeholder="Имя пользователя"
                  className={s.inUser}
                />
                <span className="fontSt_One24grey">Пароль:</span>
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Пароль"
                  type="password"
                  name="password"
                  className={s.inPass}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                />
                <button type="submit" className={s.submitBtn}>
                  Войти
                </button>
              </form>
            </div>
            {/* <div className={s.rightCont}>

            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login_Page
