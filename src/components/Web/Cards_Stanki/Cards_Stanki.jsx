import React, { useEffect, useState } from 'react'
import s from './Cards_Stanki.module.css'
import { LogoutOutlined, MessageOutlined } from '@ant-design/icons'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import pic from '../../image/Rectangle 1458.png'

import { Select, Button } from 'antd'
const Cards_Stanki = ({
  arrMachines,
  occupy_freeMachine,
  setOpenStanok,
  setElemStanok,
  setTaskBTN,
  getReasonsDowntime,
}) => {
  const [selectArr, setSelectArr] = useState(arrMachines)
  const onChange = (value) => {
    console.log(`selected ${value}`)
    if (value !== 'all') {
      // setNewArr(selectArr.filter((el) => el.id === value))
    }
  }
  const onSearch = (value) => {
    console.log('search:', value)
  }
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
  const settings = {
    className: 'center',
    // centerMode: true,
    infinite: false,
    centerPadding: '60px',
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  }
  const linkStanok = (id, el) => {
    if (id !== 'sendBTN') {
      setOpenStanok(true)
    }
  }

  useEffect(() => {
    if (arrMachines) {
      setSelectArr([{ id: 'all', name: 'Все' }, ...arrMachines])
    }
  }, [arrMachines])
  return (
    <div className={s.mainCard}>
      <div className={s.choceCard}>
        <div className={s.ch1_1}>
          <Select
            showSearch
            style={{
              width: 200,
            }}
            className={s.regCard}
            placeholder="Мой участок"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={
              [
                // {
                //   value: '1',
                //   label: 'Not Identified',
                // },
                // {
                //   value: '2',
                //   label: 'Closed',
                // },
                // {
                //   value: '3',
                //   label: 'Communicated',
                // },
                // {
                //   value: '4',
                //   label: 'Identified',
                // },
                // {
                //   value: '5',
                //   label: 'Resolved',
                // },
                // {
                //   value: '6',
                //   label: 'Cancelled',
                // },
              ]
            }
          />
          <Select
            className={s.stCard}
            showSearch
            placeholder="Выбор станка"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            defaultValue={'all'}
            filterOption={filterOption}
            options={selectArr?.map((el) => {
              return {
                value: el.id,
                label: el.name,
              }
            })}
          />
        </div>
        <div className={s.ch1_2}>
          {/* <Button className={s.btnProg}>Назначить программу</Button> */}
          {/* <Button
            className={s.messBtn}
            icon={<MessageOutlined color="rgb(0, 120, 210)" />}
          /> */}
        </div>
      </div>
      <div className={s.slider_container}>
        <Slider {...settings}>
          {arrMachines?.map((el, i) => {
            return (
              <div
                onClick={(e) => {
                  setElemStanok(el.id)
                  linkStanok(e.target.id)
                  if (el.user_bind) {
                    setTaskBTN(true)
                    getReasonsDowntime(localStorage.access, el.slug)
                  } else {
                    setTaskBTN(false)
                  }
                }}
                className={`${s.cardSt} ${
                  el.user_bind ? s.cardWork : s.cardNoWork
                }`}
                key={el.id}
              >
                <div className={s.crSt_1}>
                  <span className={`fontSt_One`}>{el.name}</span>
                  {el.user_bind ? (
                    <span className={`fontSt_Two ${s.colorWork}`}>
                      Работает{' '}
                    </span>
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
                  {el.user_bind ? el.user_bind.fullname : 'Свободен'}
                </span>

                <Button
                  onClick={(e) =>
                    occupy_freeMachine(e.target.textContent, el.slug)
                  }
                  id="sendBTN"
                  className={`${s.btnCardSt} ${
                    el.user_bind ? s.btnCardSt_back_on : s.btnCardSt_back_off
                  } fontSt_One2`}
                >
                  {el.user_bind ? (
                    <span id="sendBTN">Освободить станок</span>
                  ) : (
                    <span id="sendBTN">Занять станок</span>
                  )}
                </Button>
              </div>
            )
          })}
        </Slider>
      </div>
    </div>
  )
}
export default Cards_Stanki
