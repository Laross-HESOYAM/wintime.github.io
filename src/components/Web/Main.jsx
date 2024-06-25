import React, { useEffect, useState } from 'react'
import s from './Main.module.css'
import { Link } from 'react-router-dom'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  LogoutOutlined,
  PoweroffOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Button, Avatar, message } from 'antd'

import Cards_Stanki from './Cards_Stanki/Cards_Stanki'
import Stanok from './Stanok/Stanok'
const Main = () => {
  const navigate = useNavigate()
  const [arrMachines, setArrMachines] = useState()
  const [status, setStatus] = useState(false)
  const [openStanok, setOpenStanok] = useState(false)
  const [elemStanok, setElemStanok] = useState()
  const [taskBTN, setTaskBTN] = useState(false)
  const [cont, setCont] = useState()
  const [plain, setPlain] = useState()
  const [disBtn, setDisBtn] = useState('all')
  const [downtime, setDowntime] = useState()
  const occupy_freeMachine = (text, slug) => {
    // console.log(text, slug);
    if (text === 'Занять станок') {
      fetchMachines(slug, 'bind')
      getDowntime(localStorage.access, slug)
      getReasonsDowntime(localStorage.access, slug)
    }
    if (text === 'Освободить станок') {
      fetchMachines(slug, 'unbind')
      setPlain('')
      // setDowntime()
    }
  }
  const fetchMachines = async (slug, bind) => {
    const tokens = JSON.stringify(localStorage.access)
    try {
      const response = await fetch(
        `http://192.168.1.109:8000/tablet/machine/${slug}/${bind}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens.replace(/"/g, '')}`,
          },
        }
      )
      // .then((response) => {
      if (response.ok) {
        // console.log(response);
        setStatus(!status)
      }
      if (response.status === 403) {
        // console.log(response.status)
        message.error('Ошибка 403. У пользователя нет прав!', [10])
      }
      if (response.status === 401) {
        navigate('/')
      }
      if (!response.ok) {
        throw new Error('Сетевой запрос не удался')
      }
      // })
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }
  //Получения причин простоя
  const getReasonsDowntime = async (tok, slug) => {
    // console.log(slug)
    const url = `http://192.168.1.109:8000/machine/${slug}/online`
    // 192.168.1.109:8000/tablet/machine/usr-424/idles
    // console.log(url);
    const tokens = JSON.stringify(tok)
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.replace(/"/g, '')}`,
        },
      })
      // console.log(response);
      if (response.status === 404) {
        setTaskBTN(false)
      }
      if (response.status === 401) {
        navigate('/')
      }
      if (response.status === 200 || response.status === 201) {
        const data = await response.json()
        // console.log(data);
        console.log(data.signals.Простой)
        setPlain(data.signals.Простой)
      }
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }
  // получения причин простоя
  const getDowntime = async (tok, slug) => {
    // console.log(slug)
    const url = `http://192.168.1.109:8000/tablet/machine/${slug}/idles`
    // console.log(url)
    const tokens = JSON.stringify(tok)
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.replace(/"/g, '')}`,
        },
      })
      // console.log(response)
      if (response.status === 404) {
        // setTaskBTN(false);
      }
      if (response.status === 401) {
        navigate('/')
      }
      if (response.status === 200 || response.status === 201) {
        const data = await response.json()
        setDowntime([...data.idles])
        console.log(data)
      }
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }
  useEffect(() => {
    const fetchDataMachine = async (event) => {
      const url = 'http://192.168.1.109:8000/tablet/machines'
      const tokens = JSON.stringify(event)
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens.replace(/"/g, '')}`,
          },
        })
        // console.log(response.status)
        if (response.status === 401) {
          navigate('/')
        }
        if (response.status === 200) {
          const data = await response.json()
          // console.log('Получение станков', response)
          setArrMachines(data.machines)
        }
      } catch (error) {
        console.error('Ошибка:', error)
      }
    }
    localStorage.access && fetchDataMachine(localStorage.access)
  }, [status])

  return (
    <div className={s.mainDiv}>
      <header className={s.mainHead}>
        <div className={s.mHead1}>
          <Link to="/">
            <Button
              icon={<LogoutOutlined />}
              className={s.btnLog}
              onClick={() => localStorage.clear()}
            >
              Сменить пользователя
            </Button>
          </Link>
          <span className={s.bord}></span>
          <div className={s.headAva}>
            <Avatar size={32} icon={<UserOutlined color="white" />} />{' '}
            <span style={{ fontSize: 18, color: 'white' }}>
              {localStorage.user}
            </span>
          </div>
        </div>

        <div className={s.mHead2}>
          <Button
            className={s.logOut_btn}
            type="text"
            icon={<PoweroffOutlined style={{ fontSize: 20 }} />}
          />
        </div>
      </header>
      <Outlet />
      {!openStanok && (
        <Cards_Stanki
          arrMachines={arrMachines}
          setArrMachines={setArrMachines}
          occupy_freeMachine={occupy_freeMachine}
          setOpenStanok={setOpenStanok}
          setElemStanok={setElemStanok}
          setTaskBTN={setTaskBTN}
        />
      )}
      {openStanok && (
        <Stanok
          setOpenStanok={setOpenStanok}
          elemStanok={elemStanok}
          occupy_freeMachine={occupy_freeMachine}
          arrMachines={arrMachines}
          taskBTN={taskBTN}
          setTaskBTN={setTaskBTN}
          cont={cont}
          setCont={setCont}
          plain={plain}
          setPlain={setPlain}
          getReasonsDowntime={getReasonsDowntime}
          disBtn={disBtn}
          setDisBtn={setDisBtn}
          getDowntime={getDowntime}
          downtime={downtime}
          setDowntime={setDowntime}
        />
      )}
    </div>
  )
}

export default Main
