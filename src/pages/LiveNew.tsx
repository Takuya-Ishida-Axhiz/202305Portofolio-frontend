import { Card, Form, Input, Select, DatePicker, Button, Space, Layout, notification } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import Dragger from 'antd/es/upload/Dragger'
import { useState } from 'react'
import { format } from 'date-fns'

import axios, { AxiosResponse } from 'axios'
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload'
import { Live } from '../types/Live'
import { Link, useNavigate } from 'react-router-dom'
import { useRecoilCallback } from 'recoil'
import { liveIdsSelector } from '../states/LiveState'

interface AddFormInput {
  url: string
  bandName: string
}

const LiveNew = () => {
  const [form] = Form.useForm()
  const navigation = useNavigate()

  const [lives, setLives] = useState<Array<'object'>>([])

  const add = useRecoilCallback(({ refresh }) => async (input: AddFormInput) => {
    const { url, bandName } = input

    const headers = {
      'x-api-key': `${import.meta.env.VITE_API_KEY}`,
    }

    axios
      .post(
        `${import.meta.env.VITE_API_ENDPOINT}/lives/new`,
        {
          url,
          bandName,
        },
        { headers: headers }
      )
      .then((response) => {
        refresh(liveIdsSelector({}))
        notification.success({
          message: 'ライブを新しく登録しました。',
        })
        navigation('/')
      })
      .catch((error) => {
        console.error('Upload failed', error)
      })
  })

  return (
    <Layout style={{ width: '80%', margin: '5% auto' }}>
      <Card title="ライブを追加">
        <div style={{ padding: '10px' }}>
          <Form form={form} labelCol={{ span: 3 }} labelAlign="left" onFinish={add}>
            <Form.Item name="bandName" label="バンド名" wrapperCol={{ span: 12 }} rules={[{ required: true, message: 'バンド名は必須です' }]}>
              <Input placeholder="バンド名を入力…" />
            </Form.Item>

            <Form.Item name="url" label="URL" wrapperCol={{ span: 12 }} rules={[{ required: true, message: 'URLは必須です' }]}>
              <Input placeholder="URLを入力…" />
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
                追加する
              </Button>
            </Space>
          </Form>
        </div>
      </Card>
    </Layout>
  )
}

export default LiveNew
