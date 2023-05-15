import { Card, Form, Input, Select, DatePicker, Button, Space, Modal, Layout, UploadProps, UploadFile, Spin, notification } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons'
import Dragger from 'antd/es/upload/Dragger'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router'
import { useRecoilCallback, useRecoilValueLoadable } from 'recoil'
import { liveSelector } from '../states/LiveState'
import dayjs from 'dayjs'
import { Live } from '../types/Live'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import axios, { AxiosResponse } from 'axios'
import { RcFile } from 'antd/es/upload'

interface liveColumn {
  key: string
  bandName: string
  url: string
}

const LiveEdit = () => {
  const param = useParams<{ liveId: string }>()
  const liveId = param.liveId as string

  const navigation = useNavigate()

  const liveSelectorLoadable = useRecoilValueLoadable(liveSelector(liveId))

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [targetliveId, setTargetliveId] = useState('')
  const [form] = Form.useForm()
  const [livesState, setlivesState] = useState<Live[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)

  const columns: ColumnsType<liveColumn> = [
    {
      title: 'liveId',
      dataIndex: 'key',
      key: 'key',
      width: '5%',
    },
    {
      title: 'バンド名',
      dataIndex: 'bandName',
      key: 'bandName',
      width: '30%',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      width: '10%',
    },
    {
      title: '削除',
      dataIndex: 'bandName',
      key: 'liveId',
      width: '5%',
      render: (bandName: string) => (
        <DeleteOutlined
          color="red"
          // onClick={() => deletelive(liveNo)}
          onClick={() => {
            setTargetliveId(bandName), setIsModalOpen(true)
          }}
        />
      ),
    },
  ]

  const deletelive = (liveId: string) => {
    const newlivesState = livesState.filter((live: Live) => {
      return live.liveId !== liveId
    })

    setlivesState(newlivesState)
    setIsModalOpen(false)
  }

  const update = useRecoilCallback(({ refresh }) => async (inputValue: any) => {
    const { bandName, url } = inputValue

    const headers = {
      'x-api-key': `${import.meta.env.VITE_API_KEY}`,
    }
    await axios
      .post(
        `${import.meta.env.VITE_API_ENDPOINT}/lives/update`,
        {
          liveId,
          bandName,
          url,
        },
        { headers: headers }
      )
      .then((response) => {
        refresh(liveSelector(liveId))
        notification.success({
          message: '更新しました。',
        })
        navigation('/')
      })
      .catch((error) => {
        console.error('Upload failed', error)
      })
  })

  useEffect(() => {
    setTargetliveId('')
    if (liveSelectorLoadable.state !== 'loading') {
      setlivesState(liveSelectorLoadable.contents)
    }
  }, [liveSelectorLoadable.state])

  if (liveSelectorLoadable.state === 'loading' && livesState.length !== 0) {
    return (
      <Layout style={{ width: '80%', margin: '5% auto' }}>
        <Card title="ライブを編集">
          <div style={{ textAlign: 'center' }}>
            <Spin tip="Loading"></Spin>
          </div>
        </Card>
      </Layout>
    )
  } else {
    const live: Live = liveSelectorLoadable.contents
    return (
      <>
        <Layout style={{ width: '80%', margin: '5% auto' }}>
          <Card title="ライブを編集">
            <div style={{ padding: '10px' }}>
              <Form form={form} labelCol={{ span: 3 }} labelAlign="left" onFinish={update}>
                <Form.Item name="bandName" label="バンド名" wrapperCol={{ span: 12 }} rules={[{ required: true, message: 'バンド名は必須です' }]} initialValue={live.bandName}>
                  <Input placeholder="バンド名を入力…" />
                </Form.Item>

                <Form.Item name="url" label="タイトル" wrapperCol={{ span: 12 }} rules={[{ required: true, message: 'urlは必須です' }]} initialValue={live.url}>
                  <Input placeholder="urlを入力…" />
                </Form.Item>

                <Space
                  size={20}
                  wrap
                  style={{
                    marginTop: '50px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Link to="/">
                    <Button size="large">戻る</Button>
                  </Link>
                  <Button size="large" type="primary" htmlType="submit">
                    保存する
                  </Button>
                </Space>
              </Form>
            </div>
          </Card>
        </Layout>
      </>
    )
  }
}

export default LiveEdit
