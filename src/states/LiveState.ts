import axios, { AxiosResponse } from 'axios'
import DataLoader from 'dataloader'
import { selectorFamily } from 'recoil'
import { selector } from 'recoil'
import { Live } from '../types/Live'

const dataloader = new DataLoader(
  async (liveIds: readonly string[]) => {
    try {
      const headers = {
        'x-api-key': `${import.meta.env.VITE_API_KEY}`,
      }

      const response: AxiosResponse = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/lives/batch-get`,
        {
          liveIds,
        },
        {
          headers: headers,
        }
      )
      return response.data
    } catch (error) {
      console.error('failed', error)
      return []
    }
  },
  { cache: false, maxBatchSize: 1000 }
)
// dataloaderからliveを取得
export const liveSelector = selectorFamily({
  key: 'liveSelector',
  get: (liveId: string) => () => {
    return dataloader.load(liveId)
  },
})

// liveId取得
export const liveIdsSelector = selectorFamily({
  key: 'liveIdsSelector',
  get:
    () =>
    async ({ get }) => {
      try {
        const headers = {
          'x-api-key': `${import.meta.env.VITE_API_KEY}`,
        }

        const response: AxiosResponse = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/lives/get-all-ids`, {
          headers: headers,
        })
        const liveIds = response.data
        return liveIds
      } catch (error) {
        console.error('failed', error)
        return []
      }
    },
})

export const liveTableDataSourceSelector = selector<Live[]>({
  key: 'liveTableDataSourceSelector',
  get: async ({ get }) => {
    // 取得対象のliveIdの配列を取得
    const liveIds: string[] = get(liveIdsSelector({}))

    // Idsを使ってレコードを取得
    const lives: Live[] = liveIds.map((liveId: string) => get(liveSelector(liveId)) as Live)
    return lives
  },
})
