import { Box } from '@mui/material'
import CardTrello from './Card/CardTrello'
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'

function ListCards({ cards }) {
  return (
    <SortableContext
      items={cards?.map((c) => c._id)}
      strategy={verticalListSortingStrategy}
    >
      <Box
        sx={{
          p: '0 5px 5px 5px',
          m: '0 5px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: (theme) => `calc(${
            theme.trello.boardContentHeight
          } - ${theme.spacing(5)}
      - ${theme.trello.columnFooterHeight} - ${theme.trello.columnHeaderHeight}
      )`
        }}
      >
        {cards?.map((cardT) => {
          return <CardTrello key={cardT._id} cardT={cardT} />
        })}
      </Box>
    </SortableContext>
  )
}

export default ListCards
