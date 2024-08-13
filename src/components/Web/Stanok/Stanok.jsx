import React, { useEffect, useState } from 'react'
import s from './Stanok.module.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import { Button, Pagination, Modal, message } from 'antd'
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
  const [pageNumber, setPageNumber] = useState(1)
  const [sliceNumber, setSliceNumber] = useState(0, 6)
  const [qrMessage, setQrMessage] = useState('')
  const [isEnabled, setIsEnabled] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const stanokError = (text) => {
    messageApi.open({
      type: 'error',
      content: text,
    })
  }
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
  const createTask = async (tok, slug, res) => {
    const url = `${process.env.REACT_APP_DOMAIN}/tablet/machine/${slug}/create_work`
    const tokens = JSON.stringify(tok)
    // let work2 = JSON.stringify({
    //   target: '50',
    //   content: 'Работа',
    // })
    let work = JSON.stringify({
      target: String(res.data.target),
      content: res.data.content,
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
      if (!response.ok) {
        setIsEnabled(!isEnabled)
        stanokError('Сетевой запрос не удался')
      }
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
        setIsEnabled(!isEnabled)
      }
    } catch (error) {
      console.error('Ошибка:', error)
      setIsEnabled(!isEnabled)
      stanokError(error)
    }
  }
  //Обновить данные задания
  const updateTask = async (slug, current, defective) => {
    const url = `${process.env.REACT_APP_DOMAIN}/tablet/machine/${slug}/work`
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
      if (response.status === 401) {
        navigate('/')
      }
      if (response.status === 200 || response.status === 201) {
        const datas = await response.json()
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
    const url = `${process.env.REACT_APP_DOMAIN}/tablet/machine/${
      arrMachines.filter((el) => el.id === elemStanok)[0].slug
    }/idle`
    // const url = `${process.env.REACT_APP_DOMAIN}/tablet/machine/${id}/idle`
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
      if (response.status === 401) {
        navigate('/')
      }
      if (response.status === 200 || response.status === 201) {
        getReasonsDowntime(
          localStorage.access,
          arrMachines.filter((el) => el.id === elemStanok)[0].slug
        )
      }
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }
  //Пагинация
  const paginationOnchange = (pageNumber) => {
    setPageNumber(pageNumber)
  }
  useEffect(() => {
    //Получить текущее задание
    const getWork = async (tok, slug) => {
      const url = `${process.env.REACT_APP_DOMAIN}/tablet/machine/${slug}/work`
      const tokens = JSON.stringify(tok)
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens.replace(/"/g, '')}`,
          },
        })
        if (response.status === 404) {
          setTaskBTN(false)
        }
        if (response.status === 401) {
          navigate('/')
        }
        if (response.status === 200 || response.status === 201) {
          const data = await response.json()
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
  useEffect(() => {
    const config = { fps: 10, qrbox: { width: 200, height: 200 } }
    const html5QrCode = new Html5Qrcode('qrCodeContainer')
    const qrScanerStop = () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode
          .stop()
          .then(() => {
            console.log('Scaner stop')
            // handleSubmit()
          })
          .catch(() => console.log('Scaner error'))
      }
    }
    const qrCodeSuccess = (decodedText) => {
      const res = JSON.parse(decodedText)

      // console.log(res)
      createTask(
        localStorage.access,
        arrMachines.filter((el) => el.id === elemStanok)[0].slug,
        res
      )
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
                // setTaskBTN(false)
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
          <div className={isEnabled ? s.qrDivShow : s.qrDivNone}>
            <div
              id="qrCodeContainer"
              // style={{ height: isEnabled ? '340px' : 0 }}
            ></div>
            <Button
              style={{ background: 'red' }}
              onClick={() => setIsEnabled(!isEnabled)}
            >
              X
            </Button>
          </div>
          <div className={s.btnsNaz}>
            {!isEnabled && !taskBTN && (
              <div className={s.btnTaskQR}>
                <Button
                  disabled={
                    arrMachines.filter((el) => el.id === elemStanok)[0]
                      .user_bind
                      ? false
                      : true
                  }
                  className={s.btnCardM}
                  onClick={(e) => {
                    setIsEnabled(!isEnabled)
                  }}
                >
                  <Qr style={{ fill: 'rgb(0, 120, 210)' }} />{' '}
                  <span className="fontSt_One1">Назначить по QR</span>
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
              </div>
            )}
            {taskBTN && (
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
                          // setTaskBTN(false)
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
          {!isEnabled && (
            <div className={s.task2Main}>
              <div className={s.tsNav}>
                <span className="fontSt_foure">Причина простоя</span>
                <Pagination
                  simple
                  defaultCurrent={1}
                  total={30}
                  onChange={paginationOnchange}
                />
              </div>
              <div className={s.flebx}>
                {downtime
                  ?.filter((el, i) =>
                    pageNumber === 1
                      ? i < 6
                      : pageNumber === 2
                      ? i > 5 && i < 12
                      : pageNumber === 3
                      ? i > 11 && i < 18
                      : i > 1
                  )
                  .map((el, i) => {
                    // console.log(el.name)
                    // console.log(plain)
                    return (
                      <Button
                        // disabled={
                        // plain === el.name ||
                        // plain === null ||
                        // plain === undefined ||
                        // arrMachines.filter((el) => el.id === elemStanok)[0]
                        //   .user_bind
                        //   ? false
                        //   : true
                        // }
                        key={i}
                        id={el.code}
                        onClick={(e) => {
                          console.log(plain, 'plain')
                          console.log(e.target.id, 'id')
                          // newReasonDowntime(plain ? null : e.target.id)
                          newReasonDowntime(e.target.id)
                        }}
                        className={s.dvFl}
                        style={{
                          background:
                            plain === el.name ? 'lightgreen' : 'transparent',
                        }}
                      >
                        <span className="fontSt_six" id={el.code}>
                          {el.name}
                        </span>
                      </Button>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Stanok
