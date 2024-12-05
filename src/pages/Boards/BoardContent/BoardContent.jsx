import { Box } from '@mui/material'
import ListColumns from './ListColumn.jsx/ListColumns'
import MapOrder from '~/ulti/MapOrder'
import {
  DndContext,
  useSensor,
  useSensors,
  // MouseSensor,
  // TouchSensor,
  PointerSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  closestCenter
} from '@dnd-kit/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumn.jsx/Column/Column'
import CardTrello from './ListColumn.jsx/Column/ListCards/Card/CardTrello'
import { cloneDeep, filter, isEmpty, over } from 'lodash'
import { generatePlaceholderCard } from '~/ulti/formatter'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
// Cap nhat state trong luc di chuyen card

function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn
}) {
  // Cam bien
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 }
  })
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }
  })
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumnsState, setOrderedColumnsState] = useState([])
  //Cung 1 thoi diem chi co 1 pahn tu duoc keo
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null)
  // va cham cuoi cung (xu ly thuat toan va cham )
  const lastOverId = useRef(null)
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumnsState((prevColumns) => {
      //Tim vi tri overCard sap duoc active CArd tha
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      )
      //Tinh toan vi tri index moi
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      let newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1

      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      )
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      )
      if (nextActiveColumn) {
        // xoa card o column active
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        )
        //them placeholder neu mang rong
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        // cap nhat lai
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        )
      }
      if (nextOverColumn) {
        //Kiem tra xem co ton tai o cot column chua, co thi xoa
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        )
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        } // TH dragend phai cap nhat lai ID card
        // them card
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        )
        //xoa placeholdercard neu no dang ton tai
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        )
        // cap nhat
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        )
      }
      if (triggerFrom === 'handleDragEnd') {
        moveCardToDifferentColumn(activeDraggingCardId, oldColumnWhenDraggingCard._id, 
          nextOverColumn._id, nextColumns
        )
      }
      
      return nextColumns
    })
  }
  useEffect(() => {
    setOrderedColumnsState(board.columns)
  }, [board])
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)
    //Neu keo Card sat old column
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  // Khi tha mot phan tu
  const handleDragEnd = (event) => {
    const { active, over } = event
    // Tranh keo ra ngoai
    if (!over) return
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active
      //overcard la card dang tuong tac o tren hay duoi so voi card dang keo
      const { id: overCardId } = over
      //Tim 2 column theo Id
      const overColumn = findColumnByCardId(overCardId)
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      if (!activeColumn || !overColumn) return //khong ton 1 trong 2 column

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        //Keo tha Card giua 2 column
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      } else {
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        )
        // lay vi tri moi tu over
        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        )
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        ) //Dung array Move tuong tu keo column tron board
        const dndOrderedCardIds = dndOrderedCards.map((c) => c._id)
        setOrderedColumnsState((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns)
          const targetColumn = nextColumns.find(
            (c) => c._id === overColumn._id
          )
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardIds
          return nextColumns
        })
        moveCardInTheSameColumn(
          dndOrderedCards,
          dndOrderedCardIds,
          oldColumnWhenDraggingCard._id
        )
      }
    }
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        // lay vi tri cu tu active
        const oldColumnIndex = orderedColumnsState.findIndex(
          (c) => c._id === active.id
        )
        // lay vi tri moi tu over
        const newColumnIndex = orderedColumnsState.findIndex(
          (c) => c._id === over.id
        )
        const dndOrderedColumns = arrayMove(
          orderedColumnsState,
          oldColumnIndex,
          newColumnIndex
        )
        //Tranh delay bi flickering giao dien khi goi api
        //Dung thu vien de sap xep
        // Dung luu tru vao Database
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        setOrderedColumnsState(dndOrderedColumns)

        moveColumns(dndOrderedColumns)
      }
    }
    // neu vi tri sau khi keo tha khac voi ban dau

    setActiveDragItemData(null)
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setOldColumnWhenDraggingCard(null)
  }

  const CustomDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }
  //Xu ly thuat toan va cham
  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      //Tim diem giao nhau giua cac diem voi con tro
      const pointerIntersection = pointerWithin(args)
      if (!pointerIntersection?.length) return
      // thuat toan phat hien va cham
      // const intersections = pointerIntersection.length > 0 ?
      //   pointerIntersection : rectIntersection (args)

      //Tim overId dau tien trong sections dau tien
      let overId = getFirstCollision(pointerIntersection, 'id')
      if (overId) {
        const checkColumn = orderedColumnsState.find(
          (column) => column._id === overId
        )
        if (checkColumn) {
          overId = closestCenter({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                )
              }
            )
          })[0]?.id
        }
        lastOverId.current = overId
        return [{ id: overId }]
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumnsState]
  )
  //Tim 1 column theo card Id
  const findColumnByCardId = (cardId) => {
    return orderedColumnsState.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    )
  }
  //Trigger trong luc keo phan tu
  const handleDragOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return //Khong xu ly column
    // Keo card giua cac column
    const { active, over } = event
    if (!over || !active) return //Tranh crash web

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active
    //overcard la card dang tuong tac o tren hay duoi so voi card dang keo
    const { id: overCardId } = over
    //Tim 2 column theo Id
    const overColumn = findColumnByCardId(overCardId)
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    if (!activeColumn || !overColumn) return //khong ton 1 trong 2 column

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }
  }
  // Khi bat dau keo 1 phan tu trigger

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
    >
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          display: 'flex',
          p: '10px 0'
        }}
      >
        <ListColumns
          columns={orderedColumnsState}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
        />
        <DragOverlay dropAnimation={CustomDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <CardTrello cardT={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
