import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Card, Modal, notification, Table } from 'antd'
import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRecoilCallback, useRecoilValueLoadable } from 'recoil'
import styled from 'styled-components'
import { liveIdsSelector, liveSelector, liveTableDataSourceSelector } from '../states/LiveState'
import { Live } from '../types/Live'

interface ExerciseTableColumn {
  key: string
  liveId: string
  bandName: string
  url: string
  createdAt: string
  updatedAt: string
}

const LivesList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [targetLiveId, setTargetLiveId] = useState('')
  const navigation = useNavigate()

  const liveTableDataSourceSelectorLoadable = useRecoilValueLoadable(liveTableDataSourceSelector)

  const deleteLive = useRecoilCallback(({ snapshot, refresh }) => async (liveId: string) => {
    const headers = {
      'x-api-key': `${import.meta.env.VITE_API_KEY}`,
    }
    await axios
      .post(
        `${import.meta.env.VITE_API_ENDPOINT}/lives/delete`,
        {
          liveId,
        },
        { headers: headers }
      )
      .then(async (response) => {
        refresh(liveSelector(liveId))
        refresh(liveIdsSelector({}))
        notification.success({
          message: '削除しました。',
        })
        setIsModalOpen(false)
        navigation('/')
      })
      .catch((error) => {
        notification.error({
          message: '削除に失敗しました。',
        })
        console.error('Upload failed', error)
      })
  })

  const columns = [
    {
      title: 'バンド名',
      dataIndex: 'bandName',
      key: 'bandName',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '登録日',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: ExerciseTableColumn, b: ExerciseTableColumn) => a.createdAt.localeCompare(b.createdAt),
      render: (createdAt: string) => {
        const year = createdAt.substring(0, 4)
        const month = createdAt.substring(5, 7)
        const day = createdAt.substring(8, 10)
        return <p>{`${year}/${month}/${day}`}</p>
      },
    },
    {
      title: '更新日',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a: ExerciseTableColumn, b: ExerciseTableColumn) => a.updatedAt.localeCompare(b.updatedAt),
      render: (updatedAt: string) => {
        const year = updatedAt.substring(0, 4)
        const month = updatedAt.substring(5, 7)
        const day = updatedAt.substring(8, 10)
        return <p>{`${year}/${month}/${day}`}</p>
      },
    },
    {
      title: '編集',
      dataIndex: 'liveId',
      key: 'liveId',
      render: (liveId: string) => (
        <Link to={`live/edit/${liveId}`}>
          <EditOutlined />
        </Link>
      ),
    },
    {
      title: '削除',
      dataIndex: 'liveId',
      key: 'liveId',
      render: (liveId: string) => (
        <DeleteOutlined
          onClick={() => {
            setTargetLiveId(liveId)
            setIsModalOpen(true)
          }}
        />
      ),
    },
  ]

  return (
    <>
      <StyledCard>
        <Table
          columns={columns}
          dataSource={
            liveTableDataSourceSelectorLoadable.state === 'hasValue'
              ? liveTableDataSourceSelectorLoadable.contents.map((live: Live, index: number) => {
                  return {
                    key: index.toString(),
                    liveId: live.liveId,
                    bandName: live.bandName,
                    createdAt: live.createdAt,
                    updatedAt: live.updatedAt,
                    url: live.url,
                  }
                })
              : []
          }
          loading={liveTableDataSourceSelectorLoadable.state === 'loading' ? true : false}
        />
      </StyledCard>
      <Modal open={isModalOpen} onOk={() => deleteLive(targetLiveId)} onCancel={() => setIsModalOpen(false)}>
        <p>削除してもよろしいですか？</p>
      </Modal>
    </>
  )
}

const StyledCard = styled(Card)`
  width: 90%;
  margin: 50px auto;
`

export default LivesList
