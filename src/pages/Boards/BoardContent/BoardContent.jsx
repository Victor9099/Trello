import { Box } from '@mui/material'
import ListColumns from './ListColumn.jsx/ListColumns'
import MapOrder from '~/ulti/MapOrder'
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  PointerSensor
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
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
  const sensors = useSensors(mouseSensor,touchSensor)

  const [orderedColumnsState, setOrderedColumnsState] = useState([])
  useEffect(() => {
    setOrderedColumnsState(
      MapOrder(board?.columns, board?.columnOrderIds, '_id')
    )
  }, [board])
  const handleDragEnd = (event) => {
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
      ) //Dung thu vien de sap xep
      // Dung luu tru vao Database
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      setOrderedColumnsState(dndOrderedColumns)
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
      </Box>
    </DndContext>
  )
}

export default BoardContent
