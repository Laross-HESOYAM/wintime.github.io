import React, { useEffect, useState } from 'react'
import s from './Stanok.module.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Pagination, Modal } from 'antd'
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  MessageOutlined,
  QrcodeOutlined,
} from '@ant-design/icons'
import pic from '../../image/Rectangle 1458.png'
import { ReactComponent as ShkSVG } from '../../image/shk.svg'
import { ReactComponent as Qr } from '../../image/bx_qr.svg'

const Stanok = ({
  setOpenStanok,
  elemStanok,
  occupy_freeMachine,
  arrMachines,
  taskBTN,
  setTaskBTN,
  cont,
  setCont,
  plain,
  setPlain,
  getReasonsDowntime,
  disBtn,
  setDisBtn,
  getDowntime,
  downtime,
  setDowntime,
}) => {
  const navigate = useNavigate()
  const [current, setCurrent] = useState('')
  const [defective, setDefective] = useState(0)
  console.log(downtime)
  console.log(plain, 'PLAIN')
  // console.log(taskBTN, "task");
  // console.log(cont, "cont");
  // console.log(arrMachines);

  // MODAL
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // Создать задачу
  const createTask = async (tok, slug) => {
    const url = `http://192.168.1.109:8000/tablet/machine/${slug}/create_work`
    console.log(url)
    const tokens = JSON.stringify(tok)
    let work = JSON.stringify({
      target: '50',
      content: 'Работа',
    })
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.replace(/"/g, '')}`,
        },
        body: work,
      })
      // console.log(response.json())
      // console.log(response)
      if (response.status === 401) {
        navigate('/')
      }
      if (response.status === 200 || response.status === 201) {
        const datas = await response.json()
        console.log(datas)
        setCont({
          cont: datas.content,
          cur: datas.current,
          def: datas.defective,
          tar: datas.target,
        })
        // console.log('Получение станков', response)
        // setArrMachines(data.machines)
        setTaskBTN(true)
      }
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }
  //Обновить данные задания
  const updateTask = async (slug, current, defective) => {
    const url = `http://192.168.1.109:8000/tablet/machine/${slug}/work`

    console.log(url)
    console.log(current, 'выполнено')
    console.log(defective, 'Брак')

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.access.replace(/"/g, '')}`,
        },
        body: JSON.stringify({
          target: 1000,
          content: 'Создать 1000 деталей',
          current: current,
          defective: defective,
        }),
      })
      // console.log(response.json())
      // console.log(response)
      if (response.status === 401) {
        navigate('/')
      }
      if (response.status === 200 || response.status === 201) {
        const datas = await response.json()
        console.log(datas)
        setCont({
          cont: datas.content,
          cur: datas.current,
          def: datas.defective,
          tar: datas.target,
        })
        setIsModalOpen2(true)
        // setTaskBTN(false)
      }
    } catch (error) {
      console.error('Ошибка:', error)
    }
    setIsModalOpen(false)
  }
  //!новая причина простоя
  const newReasonDowntime = async (id) => {
    console.log()
    const url = `http://192.168.1.109:8000/tablet/machine/${
      arrMachines.filter((el) => el.id === elemStanok)[0].slug
    }/idle`
    console.log(url)
    const tokens = JSON.stringify(localStorage.access)
    const work = JSON.stringify({
      code: id,
    })
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.replace(/"/g, '')}`,
        },
        body: work,
      })
      // console.log(response.json())
      console.log(response)
      if (response.status === 401) {
        navigate('/')
      }
      if (response.status === 200 || response.status === 201) {
        console.log(response)
        getReasonsDowntime(
          localStorage.access,
          arrMachines.filter((el) => el.id === elemStanok)[0].slug
        )
        // const datas = await response.json()
        // console.log(datas)
      }
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }
  useEffect(() => {
    // console.log(taskBTN);
    //Получить текущее задание
    const getWork = async (tok, slug) => {
      // console.log(slug)
      const url = `http://192.168.1.109:8000/tablet/machine/${slug}/work`
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
          setTaskBTN(false)
        }
        if (response.status === 401) {
          navigate('/')
        }
        if (response.status === 200 || response.status === 201) {
          const data = await response.json()
          // console.log(data)
          setCont({
            cont: data.content,
            cur: data.current,
            def: data.defective,
            tar: data.target,
          })
        }
      } catch (error) {
        console.error('Ошибка:', error)
      }
    }
    // // получения причин простоя
    // const getDowntime = async (tok, slug) => {
    //   // console.log(slug)
    //   const url = `http://192.168.1.109:8000/tablet/machine/${slug}/idles`
    //   // console.log(url)
    //   const tokens = JSON.stringify(tok)
    //   try {
    //     const response = await fetch(url, {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${tokens.replace(/"/g, '')}`,
    //       },
    //     })
    //     // console.log(response)
    //     if (response.status === 404) {
    //       // setTaskBTN(false);
    //     }
    //     if (response.status === 401) {
    //       navigate('/')
    //     }
    //     if (response.status === 200 || response.status === 201) {
    //       const data = await response.json()
    //       setDowntime([...data.idles])
    //       console.log(data)
    //     }
    //   } catch (error) {
    //     console.error('Ошибка:', error)
    //   }
    // }

    if (arrMachines.filter((el) => el.id === elemStanok)[0].user_bind) {
      getWork(
        localStorage.access,
        arrMachines.filter((el) => el.id === elemStanok)[0].slug
      )
    }
    getDowntime(
      localStorage.access,
      arrMachines.filter((el) => el.id === elemStanok)[0].slug
    )
  }, [])
  return (
    <div className={s.main}>
      <div className={s.hedMain}>
        <Link to="/main">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => setOpenStanok(false)}
          >
            Назад
          </Button>
        </Link>
        {/* <Button icon={<MessageOutlined />}></Button> */}
      </div>
      <div className={s.wrapMain}>
        <div className={s.cardStMain}>
          <div
            to="stanok"
            className={`${s.cardSt} ${
              arrMachines.filter((el) => el.id === elemStanok)[0].user_bind
                ? s.cardWork
                : s.cardNoWork
            }`}
          >
            <div className={s.crSt_1}>
              <span className={`fontSt_One`}>
                {arrMachines.filter((el) => el.id === elemStanok)[0].name}
              </span>
              {arrMachines.filter((el) => el.id === elemStanok)[0].user_bind ? (
                <span className={`fontSt_Two ${s.colorWork}`}>Работает</span>
              ) : (
                <span className={`fontSt_Two`}>Ожидает </span>
              )}
              <img src={pic} alt="" />
              <div className={s.crMin1}>
                <span className="fontSt_three">Подача</span>
                <span className="fontSt_three2">100</span>
              </div>
              <div className={s.crMin1}>
                <span className="fontSt_three">Скорость</span>
                <span className="fontSt_three2">100</span>
              </div>
            </div>

            <span className="fontSt_three2">
              {arrMachines.filter((el) => el.id === elemStanok)[0].user_bind
                ? arrMachines.filter((el) => el.id === elemStanok)[0].user_bind
                    .fullname
                : 'Свободен'}
            </span>

            <Button
              onClick={(e) => {
                occupy_freeMachine(
                  e.target.textContent,
                  arrMachines.filter((el) => el.id === elemStanok)[0].slug
                )
                setTaskBTN(false)
              }}
              id="sendBTN"
              className={`${s.btnCardSt} ${
                arrMachines.filter((el) => el.id === elemStanok)[0].user_bind
                  ? s.btnCardSt_back_on
                  : s.btnCardSt_back_off
              } fontSt_One2`}
            >
              {arrMachines.filter((el) => el.id === elemStanok)[0].user_bind ? (
                <span id="sendBTN">Освободить станок</span>
              ) : (
                <span id="sendBTN">Занять станок</span>
              )}
            </Button>
          </div>
        </div>
        <div className={s.taskMain}>
          <span className="fontSt_foure">Задание </span>
          <div className={s.btnsNaz}>
            {!taskBTN ? (
              <>
                <Button
                  disabled={
                    arrMachines.filter((el) => el.id === elemStanok)[0]
                      .user_bind
                      ? false
                      : true
                  }
                  className={s.btnCardM}
                  onClick={(e) => {
                    createTask(
                      localStorage.access,
                      arrMachines.filter((el) => el.id === elemStanok)[0].slug
                    )
                  }}
                >
                  <Qr /> <span className="fontSt_One1">Назначить по QR</span>
                </Button>
                <Button
                  className={s.btnCardM}
                  disabled={
                    arrMachines.filter((el) => el.id === elemStanok)[0]
                      .user_bind
                      ? false
                      : true
                  }
                >
                  <ShkSVG />{' '}
                  <span className="fontSt_One1">Назначить по ШК</span>
                </Button>
              </>
            ) : (
              <div className={s.taskOut}>
                <div className={s.grupTask}>
                  <span className="fontSt_foure" style={{ fontSize: '24px' }}>
                    {cont?.cont}
                  </span>
                  <div className={s.flGap}>
                    <span className="fontSt_three2">Количество изделий</span>
                    <span className="fontSt_three2">{`${cont?.cur} / ${cont?.tar}`}</span>
                  </div>
                </div>
                <div className={s.tasRigOut}>
                  <Button
                    type="text"
                    icon={<FileTextOutlined />}
                    className={`${s.docDtn}`}
                  >
                    <span className={`${s.docText}`}> Документация</span>
                  </Button>
                  <Button
                    onClick={(e) => {
                      showModal()
                    }}
                    className={`${s.btnOut} fontSt_One2`}
                  >
                    Завершить
                  </Button>
                  <Modal
                    className="modalTask modalTask1"
                    title="Завершить задание?"
                    open={isModalOpen}
                    // onOk={handleOk}
                    // onCancel={handleCancel}
                    width={800}
                    body={100}
                    footer={[
                      <Button
                        key="submit"
                        type="primary"
                        onClick={() => {
                          updateTask(
                            arrMachines.filter((el) => el.id === elemStanok)[0]
                              .slug,
                            current,
                            defective
                          )
                        }}
                        className={s.btnSubModal}
                      >
                        Завершить
                      </Button>,
                      <Button
                        key="back"
                        onClick={handleCancel}
                        className={s.btnSubModal}
                      >
                        Отмена
                      </Button>,
                    ]}
                  >
                    <div className={s.flT}>
                      <span className="fontSt_32">Станок</span>
                      <span className="fontSt_32b">
                        {
                          arrMachines.filter((el) => el.id === elemStanok)[0]
                            .name
                        }
                      </span>
                    </div>
                    <div className={s.flT}>
                      <span className="fontSt_32">Программа</span>
                      <span className="fontSt_32b">{cont?.cont}</span>
                    </div>
                    <div className={s.flT}>
                      <span className="fontSt_32">План</span>
                      <span className="fontSt_32b">{`${cont?.tar} шт.`}</span>
                    </div>
                    <div className={s.flT}>
                      <span className="fontSt_32">Выполненно</span>
                      <span className={`${s.pseudo_input} fontSt_32`}>
                        <input
                          type="number"
                          value={current}
                          onChange={(e) => setCurrent(e.target.value)}
                        />
                        Шт.
                      </span>
                    </div>
                    <div className={s.flT}>
                      <span className="fontSt_32">Брак</span>
                      <span className={`${s.pseudo_input} fontSt_32`}>
                        <input
                          type="number"
                          value={defective}
                          onChange={(e) => setDefective(e.target.value)}
                        />
                        Шт.
                      </span>
                    </div>
                  </Modal>
                  <Modal
                    className="modalTask modalTask2"
                    title="Задание завершено!"
                    open={isModalOpen2}
                    // onOk={handleOk}
                    // onCancel={handleCancel}
                    width={800}
                    body={100}
                    footer={[
                      <Button
                        key="submit"
                        type="primary"
                        onClick={() => {
                          setIsModalOpen2(false)
                          setOpenStanok(false)
                        }}
                        className={s.btnSubModal}
                      >
                        Выйти в меню
                      </Button>,
                      <Button
                        key="back"
                        className={s.btnSubModal}
                        onClick={(e) => {
                          occupy_freeMachine(
                            'Освободить станок',
                            arrMachines.filter((el) => el.id === elemStanok)[0]
                              .slug
                          )
                          setTaskBTN(false)
                          setIsModalOpen2(false)
                        }}
                      >
                        Выключить станок
                      </Button>,
                    ]}
                  >
                    <div className={s.flT}>
                      <span className="fontSt_32">Станок</span>
                      <span className="fontSt_32b">
                        {
                          arrMachines.filter((el) => el.id === elemStanok)[0]
                            .name
                        }
                      </span>
                    </div>
                    <div className={s.flT}>
                      <span className="fontSt_32">Программа</span>
                      <span className="fontSt_32b">{cont?.cont}</span>
                    </div>
                  </Modal>
                </div>
              </div>
            )}
          </div>
          <div className={s.task2Main}>
            <div className={s.tsNav}>
              <span className="fontSt_foure">Причина простоя</span>
              <Pagination simple defaultCurrent={1} total={50} />
            </div>
            <div className={s.flebx}>
              {downtime?.map((el, i) => {
                return (
                  <Button
                    disabled={
                      plain === el.name || plain === null || plain === undefined
                        ? false
                        : true
                    }
                    key={i}
                    onClick={(e) =>
                      newReasonDowntime(plain ? null : e.target.id)
                    }
                    id={el.code}
                    className={s.dvFl}
                    style={{
                      background:
                        plain === el.name ? 'lightgreen' : 'transparent',
                    }}
                  >
                    <span className="fontSt_six" id="1">
                      {el.name}
                    </span>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stanok
