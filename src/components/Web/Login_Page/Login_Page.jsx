import React, { useEffect, useRef, useState } from 'react'
import s from './Login_Page.module.css'
import { useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'

import { Button, Checkbox, Form, Input } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { ReactComponent as Qr } from '../../image/bx_qr.svg'
import { ReactComponent as ShkSVG } from '../../image/shk.svg'

const Login_Page = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState()
  const [pass, setPass] = useState()
  const [error, setError] = useState(false)
  const [btnQR, setBtnQR] = useState(false)
  const [inpQR, setInpQR] = useState()
  const [disQR, setDisQR] = useState(false)

  const [isEnabled, setIsEnabled] = useState(false)
  const [qrMessage, setQrMessage] = useState('')
  const formRef = useRef(null)
  const input1 = useRef(null)

  const handleSubmit = async (event) => {
    // console.log(formRef.current)
    console.log(user)
    console.log(pass)
    !isEnabled && event.preventDefault()
    // setDisQR(true)
    const formData = new FormData(formRef.current)
    console.log(new FormData(formRef.current))
    try {
      const response = await fetch('http://192.168.1.109:8000/login', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log(result)

        localStorage.setItem('access', result.access_token)
        localStorage.setItem('user', user)
        navigate('/main')
      }
      if (response.status === 401) {
        setError(true)
        setUser()
        setPass()
        setDisQR(false)
        setBtnQR(false)
        setIsEnabled(false)
        console.log('error', response.status)
      }
    } catch (error) {
      setDisQR(false)
      console.log(error)
      error === '' ? alert('Ошибка:', error) : alert('ERR_CONNECTION_TIMED_OUT')
    }
  }

  useEffect(() => {
    const config = { fps: 10, qrbox: { width: 200, height: 200 } }
    const html5QrCode = new Html5Qrcode('qrCodeContainer')
    const qrScanerStop = () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode
          .stop()
          .then(() => {
            console.log('Scaner stop')
            handleSubmit()
          })
          .catch(() => console.log('Scaner error'))
      }
    }
    const qrCodeSuccess = (decodedText) => {
      const res = JSON.parse(decodedText)

      console.log(res)
      console.log(res.data.username)
      console.log(res.data.password)
      localStorage.setItem('user', res.data.username)
      setUser(res.data.username)
      setPass(res.data.password)
      setQrMessage(decodedText)
      // setBtnQR(false)
      // handleSubmit()
      setIsEnabled(false)
    }

    if (isEnabled) {
      html5QrCode.start({ facingMode: 'environment' }, config, qrCodeSuccess)
      setQrMessage('')
    } else {
      qrScanerStop()
    }
    return () => {
      qrScanerStop()
    }
  }, [isEnabled])

  return (
    <>
      <div>
        <header className={s.mainHead}>
          <div className={s.mHead1}></div>
        </header>
        <div className={s.cont}>
          <div className={s.contCentr}>
            <div className={s.contCenChl}>
              <div className={s.leftCont}>
                {!btnQR ? (
                  <div className={s.logPastext}>
                    <span className="fontSt_seven">Введите логин и пароль</span>
                  </div>
                ) : (
                  <>
                    <span className="fontSt_seven">Отсканируйте QR код</span>
                  </>
                )}
                <div id="qrCodeContainer"></div>
                {/* {!btnQR && ( */}
                <form
                  style={{
                    position: !btnQR ? '' : 'absolute',
                    opacity: !btnQR ? 1 : 0,
                  }}
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className={s.formSub}
                >
                  <span className="fontSt_One24grey">Логин:</span>
                  <Input
                    type="text"
                    name="username"
                    value={user}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    required
                    prefix={<UserOutlined />}
                    placeholder="Имя пользователя"
                    className={s.inUser}
                    onFocus={(e) => {
                      console.log(e.target.value)
                      setError(false)
                    }}
                  />
                  <span className="fontSt_One24grey">Пароль:</span>
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Пароль"
                    type="password"
                    name="password"
                    autoComplete="off"
                    className={s.inPass}
                    value={pass}
                    onChange={(e) => {
                      if (!btnQR) {
                        setPass(e.target.value)
                      }
                    }}
                    onFocus={(e) => {
                      if (btnQR) {
                        console.log(e.target)
                        setPass(1243)
                      }
                      setError(false)
                    }}
                    required
                  />

                  <div className={s.warningDiv}>
                    {error && <span>Внимание: неверный логин или пароль!</span>}
                  </div>
                  <button type="submit" className={s.submitBtn}>
                    Войти
                  </button>
                </form>
                {/* )} */}
              </div>
              <div className={s.rightCont}>
                <span className="fontSt_seven">Или</span>
                <div className={s.rigChaldBtn}>
                  <Button
                    className={`${s.btnCardM} ${
                      btnQR ? s.btnQR_ACT : s.btnQR_dis
                    }`}
                    onClick={() => {
                      setIsEnabled(!isEnabled)
                      // !btnQR && handleClick1()
                      setBtnQR(!btnQR)
                    }}
                  >
                    <Qr className={btnQR ? s.btnQR_ACT : s.btnQR_dis} />
                    <span
                      className={`fontSt_One1 ${
                        btnQR ? s.btnQR_ACT : s.btnQR_dis
                      }`}
                    >
                      Войти по QR
                    </span>
                  </Button>
                  <Button className={s.btnCardM}>
                    <ShkSVG /> <span className="fontSt_One1">Войти по ШК</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login_Page
