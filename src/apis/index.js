import axios from 'axios'
import { API_ROOT } from '~/ulti/constant'
export const fetchBoardDetailsApi = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // axios tra ve ket qua nam trong cuc request.data
  return response.data
}

export const updateBoardDetailsApi = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  // axios tra ve ket qua nam trong cuc request.data
  return response.data
}
export const createNewColumnApi = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}
export const updateColumnDetailsApi = async (columnId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  // axios tra ve ket qua nam trong cuc request.data
  return response.data
}
export const createNewCardApi = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}
export const moveCardToDifferentColumnApi = async (updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  // axios tra ve ket qua nam trong cuc request.data
  return response.data
}