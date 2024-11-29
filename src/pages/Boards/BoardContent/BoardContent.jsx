import { Box } from '@mui/material'
import ListColumns from './ListColumn.jsx/ListColumns'
import MapOrder from '~/ulti/MapOrder'
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  PointerSensor,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumn.jsx/Column/Column'
import CardTrello from './ListColumn.jsx/Column/ListCards/Card/CardTrello'
import { cloneDeep, filter } from 'lodash'
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
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
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    setOrderedColumnsState(
      MapOrder(board?.columns, board?.columnOrderIds, '_id')
    )
  }, [board])
  // Khi tha mot phan tu
  const handleDragEnd = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      return
    }
    const { active, over } = event
    // Tranh keo ra ngoai
    if (!over) return

    // neu vi tri sau khi keo tha khac voi ban dau
    if (active.id !== over.id) {
      // lay vi tri cu tu active
      const oldIndex = orderedColumnsState.findIndex(
        (c) => c._id === active.id
      )
      // lay vi tri moi tu over
      const newIndex = orderedColumnsState.findIndex((c) => c._id === over.id)
      const dndOrderedColumns = arrayMove(
        orderedColumnsState,
        oldIndex,
        newIndex
      )
      //Dung thu vien de sap xep
      // Dung luu tru vao Database
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      setOrderedColumnsState(dndOrderedColumns)
    }
    setActiveDragItemData(null)
    setActiveDragItemId(null)
    setActiveDragItemType(null)
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
          // them card
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(
            newCardIndex,
            0,
            activeDraggingCardData
          )
          // cap nhat
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
            (card) => card._id
          )
        }

        return nextColumns
      })
    }
  }
  // Khi bat dau keo 1 phan tu trigger
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)
  }
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
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
        <ListColumns columns={orderedColumnsState} />
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
