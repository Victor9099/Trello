import { Box, Container, Typography } from '@mui/material'
import AppBar from '../../components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import {
  fetchBoardDetailsApi,
  createNewColumnApi,
  createNewCardApi,
  updateBoardDetailsApi,
  updateColumnDetailsApi,
  moveCardToDifferentColumnApi
} from '~/apis'
import MapOrder from '~/ulti/MapOrder'
import { generatePlaceholderCard } from '~/ulti/formatter'
import { isEmpty } from 'lodash'
function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '674f10f74c384ff69fc82868'
    fetchBoardDetailsApi(boardId).then((board) => {
      // sap xep column luon truoc khi di xuong duoi
      board.column = MapOrder(board?.columns, board?.columnOrderIds, '_id')
      //xu ly van de keo tha vao 1 column rong
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          //Sap xep card trc khi dua xuong duoi
          column.cards = MapOrder(column?.cards, column?.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })
  }, [])
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnApi({
      ...newColumnData,
      boardId: board._id
    })
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]
    //Cap nhat lai giao dien
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardApi({
      ...newCardData,
      boardId: board._id
    })
    console.log('createdCard: ', createdCard)
    //Cap nhat lai giao dien
    const newBoard = { ...board }
    const columnToUpDate = newBoard.columns.find(
      (column) => column._id === createdCard.columnId
    )
    if (columnToUpDate) {
      if (columnToUpDate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpDate.cards = [createdCard]
        columnToUpDate.cardOrderIds = [createdCard._id]
      } else {
        columnToUpDate.cards.push(createdCard)
        columnToUpDate.cardOrderIds.push(createdCard._id)     
    }}
    setBoard(newBoard)
  }
  //Func goi Api va xu ly sau khi keo tha column xong
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)

    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)
    //Goi api update board
    updateBoardDetailsApi(newBoard._id, {
      columnOrderIds: newBoard.columnOrderIds
    })
  }
  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    //Update stateBoard
    const newBoard = { ...board }
    const columnToUpDate = newBoard.columns.find(
      (column) => column._id === columnId
    )
    if (columnToUpDate) {
      columnToUpDate.cards = dndOrderedCards
      columnToUpDate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)
    //Update Column
    updateColumnDetailsApi(columnId, { cardOrderIds: dndOrderedCardIds })
  }
  // Di chuyen card sang col khac. Cap nhat mang col ban dau chua no
  // Cap nhat mang col cua col tiep theo
  // Cap nhat lai truong columnId
  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnID,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)

    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)
    //Goi api xu ly phia backend
    let prevCardOrderIds = dndOrderedColumns.find(
      (c) => c._id === prevColumnID
    ).cardOrderIds
    // xu ly van de phan tu cuoi co placeholder card
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    moveCardToDifferentColumnApi({
      currentCardId,
      prevColumnID,
      prevCardOrderIds: prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
        .cardOrderIds
    })
  }
  if (!board) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100vw',
          height: '100vh'
        }}
      >
        <CircularProgress />
        <Typography>Loading ... </Typography>
      </Box>
    )
  }
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: '100vh',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
      }}
    >
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
